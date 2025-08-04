<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\CableBillService;
use App\Services\AirtimeService;
use App\Services\SmeplugService;
use App\Services\VTPassService;
use Illuminate\Http\Response;
use App\Services\DataService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


class VTUController extends Controller
{
    //
    // return response([
    //     'success' => true,
    //     'data'    => $dataPlan
    // ]);

    protected $smeplug;
    protected $dataService;
    protected $vtpassService;
    protected $airtimeService;
    protected $cablebillService;


    public function __construct()
    {
        $this->smeplug = new SmeplugService;
        $this->dataService = new DataService;
        $this->vtpassService = new VTPassService;
        $this->airtimeService = new AirtimeService;
        $this->cablebillService = new CableBillService;
    }

    /**
     * Handle data purchase
     *
     * @param Request $request
     * @return Response
     */
    //
    public function buyData(Request $request)
    : Response
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'plan_id'   => 'required|exists:data_prices,id',
                'phone'     => 'required|string'
            ]);

            $user       = auth()->user();
            $wallet     = $user->wallet_naira;
            $dataPlan   = $this->dataService->findDataPlan($request->plan_id);
            $amount     = $dataPlan->price;
            $ref        = Str::uuid();

            if ($wallet < $amount) {
                return response([
                    'message' => __('app.insufficient_funds'),
                    'status'  => false
                ], 400);
            }

            $user->wallet_naira -= $amount;
            $user->save();

            $response   = $this->smeplug->purchaseData($dataPlan->network_id, $dataPlan->smeplug_plan_id, $request->phone, $ref);
            // return response([
            //     'success' => true,
            //     'data'    => $response
            // ]);
            $status     = $response['status'] == 'success' ? 'success' : 'failed';

            $this->dataService->createDataHistory([
                'user_id'       => $user->id,
                'network_id'    => $dataPlan->network_id,
                'data_price_id' => $dataPlan->id,
                'phone'         => $request->phone,
                'amount'        => $dataPlan->price,
                'status'        => $status,
                'reference'     => $ref,
            ]);

            DB::commit();
            return response([
                'success' => $status === 'success',
                'message' => $response['message'] ?? 'Something went wrong!',
                'results' => [
                    'data' => $response,
                ],
            ]);

        } catch (\Exception $e) {

            DB::rollBack();
            return response([
                'message' => __('app.internal_server'),
                'status'  => false,
                'error' => $e->getMessage()
            ], 500);

        }
    }

    /**
     * Handle airtime purchase
     *
     * @param Request $request
     * @return Response
     */
    //
    public function buyAirtime(Request $request)
    : Response
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'network_id'    => 'required|exists:networks,id',
                'phone'         => 'required|string',
                'amount'        => 'required|numeric|min:50'
            ]);

            $user       = auth()->user();
            $wallet     = $user->wallet_naira;
            $network    = $request->network_id;
            $phone      = $request->phone;
            $amount     = $request->amount;
            $percentage = $this->airtimeService->getAirtimePercentage($network)?->percentage ?? 2;
            $ref        = Str::uuid();
            $amtTopay   = $amount - (($percentage / 100) * $amount);

            if ($wallet < $amtTopay) {
                return response([
                    'message' => __('app.insufficient_funds'),
                    'status'  => false
                ], 400);
            }

            $user->wallet_naira -= $amtTopay;
            $user->save();
            $response   = $this->smeplug->purchaseAirtime($network, $phone, $amount, $ref);
            $status     = $response['status'] == 'success' ? 'success' : 'failed';
            $commission = ($percentage / 100) * $amount;

            $this->airtimeService->createAirtimeHistory([
                'user_id'       => $user->id,
                'network_id'    => $network->id,
                'phone'         => $request->phone,
                'amount'        => $amount,
                'commission'    => $commission,
                'status'        => $status,
                'reference'     => $ref,
            ]);

            DB::commit();
            return response()->json([
                'success' => $status === 'success',
                'message' => $response['message'] ?? 'Something went wrong!',
                'results' => [
                    'data' => $response,
                ]
            ]);

        } catch (\Exception $e) {

            DB::rollBack();
            return response([
                'message' => __('app.internal_server'),
                'status'  => false,
                'error' => $e->getMessage()
            ], 500);

        }
    }


    /**
     * Handle cable purchase
     *
     * @param Request $request
     * @return Response
     */
    //
    public function buyCable(Request $request)
    {
        DB::beginTransaction();
        try {

            $request->validate([
                'planID'       => 'required|numeric', //planID
                'billersCode'  => 'required|string',
                'phone'        => 'required|numeric|min:50'
            ]);

            $reference      = uniqid('vtu_');
            $user           = Auth::user();
            $wallet         = $user->wallet_naira;
            $planID         = $request->planID;
            $cablePlan      = $this->cablebillService->cablePlan($planID);
            $serviceID      = $cablePlan->cable->identifier;
            $billersCode    = $request->billersCode;
            $variationCode  = $cablePlan->code;
            $amount         = $cablePlan->buy_price;
            $sellAmount     = $cablePlan->amount;
            $phone          = $request->phone;
            $ref            = Str::uuid();

            if ($wallet < $sellAmount) {
                return response([
                    'message' => __('app.insufficient_funds'),
                    'status'  => false
                ], 400);
            }

            $user->wallet_naira -= $sellAmount;
            $user->save();

            $response       = json_decode($this->vtpassService->payCable($serviceID, $billersCode, $amount, $variationCode, $phone));
            $status         = $response->code == '000' ? 'success' : 'failed';

            $this->cablebillService->createCableHistory([
                'user_id'       => $user->id,
                'cable_id'      => $cablePlan->cable_id,
                'cable_plan_id' => $cablePlan->id,
                'iuc_number'    => $billersCode,
                'phone'         => $phone,
                'amount'        => $amount,
                'status'        => $status,
                'reference'     => $ref,
            ]);


            if ($response->code != '000') {
                DB::rollBack();
                return response([
                    'message'   => __('app.operation_failed'),
                    'status'    => false,
                    'data'      => $response,
                    ], 500);
            }

            DB::commit();
            return response()->json([
                'success' => $status === 'success',
                'message' => $response->response_description ?? 'Something went wrong!',
                'results' => [
                    'data' => $response,
                ]
            ]);
        } catch (\Exception $e) {

            DB::rollBack();
            return response([
                'message' => __('app.internal_server'),
                'status'  => false,
                'error' => $e->getMessage()
            ], 500);

        }
    }

    /**
     * Handle bill purchase
     *
     * @param Request $request
     * @return Response
     */
    //
    public function buyBill(Request $request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'serviceId'     => 'required|exists:bills,id', //ikeja-electric - 7
                'billersCode'   => 'required|string', //1010101010101-postpaid - 1111111111111-prepaid
                'variationCode' => 'required|string', //prepaid or postpaid
                'amount'        => 'required|numeric|min:50',
                'phone'         => 'required|numeric|min:50'
            ]);

            $user           = auth()->user();
            $wallet         = $user->wallet_naira;
            $ref            = Str::uuid();
            $serviceId      = $request->serviceId;
            $Bill           = $this->cablebillService->getBill($serviceId);
            $serviceID      = $Bill->serviceID;
            $billersCode    = $request->billersCode;
            $variationCode  = $request->variationCode;
            $amount         = $request->amount;
            $phone          = $request->phone;

            if ($wallet < $amount) {
                return response([
                    'message' => __('app.insufficient_funds'),
                    'status'  => false
                ], 400);
            }

            $user->wallet_naira -= $amount;
            $user->save();

            $response       = json_decode($this->vtpassService->payBill($serviceID, $billersCode, $amount, $variationCode, $phone));
            $status         = $response->code == '000' ? 'success' : 'failed';

            if ($response->code != '000') {
                DB::rollBack();
                return response([
                    'message'   => __('app.operation_failed'),
                    'status'    => false,
                    'data'      => $response,
                    ], 500);
            }

            $this->cablebillService->createBillHistory([
                'user_id'       => $user->id,
                'bill_id'       => $serviceId,
                'account_number'=> $billersCode,
                'phone'         => $phone,
                'customer'      => $response->content->transactions->commission,
                'amount'        => $amount,
                'status'        => $status,
                'reference'     => $ref,
            ]);

            DB::commit();
            return response()->json([
                'success' => $status,
                'message' => $response->response_description ?? 'Something went wrong!',
                'results' => [
                    'data' => $response,
                ]
            ]);
        } catch (\Exception $e) {

            DB::rollBack();
            return response([
                'message' => __('app.internal_server'),
                'status'  => false,
                'error' => $e->getMessage()
            ], 500);

        }
    }


    /**
     * Handle data plans
     *
     * @param Request $request
     * @return Response
     */
    //
    public function getDataPlans()
    {
        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'data' => $this->dataService->getDataPlansActive(),
            ]
            ]);
    }


    /**
     * Handle data plan by network
     *
     * @param Request $request
     * @return Response
     */
    //
    public function dataByNetwork($id)
    {
        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'data' => $this->dataService->getDataPlansByNetwork($id),
            ]
            ]);
    }

    /**
     * Handle cable plans
     *
     * @param Request $request
     * @return Response
     */
    //
    public function getCablePlans()
    {
        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'data' => $this->cablebillService->cablePlansActive(),
            ]
            ]);
    }

    /**
     * Handle cable plan by cable ID
     *
     * @param Request $request
     * @return Response
     */
    //
    public function cablePlan($id)
    {
        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'data' => $this->cablebillService->cablePlan($id),
            ]
            ]);
    }

    /**
     * Handle cables
     *
     * @param Request $request
     * @return Response
     */
    //
    public function cables()
    {
        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'data' => $this->cablebillService->cablesActive(),
            ]
        ]);
    }


    /**
     * Handle bills
     *
     * @param Request $request
     * @return Response
     */
    //
    public function bills()
    {
        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'data' => $this->cablebillService->billsActive(),
            ]
            ]);
    }

    /**
     * Handle Airtime Percentages
     *
     * @param Request $request
     * @return Response
     */
    //
    public function getAirtimePercentages()
    {
        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'data' => $this->airtimeService->getAirtimePercentages(),
            ]
            ]);
    }


    /**
     * Handle Airtime Percentage By Network ID
     *
     * @param Request $request
     * @return Response
     */
    //
    public function getAirtimePercentage($id)
    {
        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'data' => $this->airtimeService->getAirtimePercentage($id),
            ]
            ]);
    }

    /**
     * Handle bill number verification
     *
     * @param Request $request
     * @return Response
     */
    //
    public function verifyBillNo(Request $request)
    {
        $request->validate([
            'billersCode'   => 'required|numeric', // 1111111111111-prepaid, 1010101010101-postpaid
            'serviceID'     => 'required|string', // ikeja-electric
            'type'          => 'nullable|string',// prepaid or postpaid
        ]);

        $return = $this->vtpassService->validate([
            'billersCode'   => $request->billersCode,
            'serviceID'     => $request->serviceID,
            'type'          => $request->type
        ]);

        $response = json_decode(json_encode($return));

        // return response([
        //     'data'  => $response->code
        // ]);

        if ($response->code != '000') {
            return response([
                'message'   => __('app.data_verification_failed'),
                'status'    => false,
                ], 404);
        }

        return response([
            'message'   => __('app.data_verified_successfully'),
            'status'    => true,
            'results'   => [
                'data' => $response,
            ]
            ]);
    }

    // Histories and history details goes here ++++++++++++++++++++++++++++++++++++++++++++
    public function getMyDataHistories(Request $request)
    {
        $user = Auth::user();
        return response([
            'message' => __('app.data_retrieved_successfully'),
            'success' => true,
            'results' => [
                'data' => $this->dataService->getUserDataHistory($user->id),
            ],
        ]);
    }
    public function dataDetails($id)
    {

        $user = Auth::user();
        if (!$user) {
            return response([
                'message'   => __('auth.unauthorized'),
                'status'    => false,
            ], 401);
        }
        $data = $this->dataService->readDataHistory($id);
        if (!$data) {

            return response([
                'message'   => __('app.data_retrieved_failed'),
                'status'    => false,
            ], 404);
        }
        return response([
            'success' => true,
            'message' => __('app.data_retrieved_successfully'),
            'result' => ['data' => $data]
        ]);
    }

    public function getMyAirtimeHistories(Request $request)
    {
        $user = Auth::user();
        return response([
            'message' => __('app.data_retrieved_successfully'),
            'success' => true,
            'results' => [
                'data' => $this->airtimeService->getUserAirtimeHistory($user->id),
            ],
        ]);
    }
    public function airtimeDetails($id)
    {

        $user = Auth::user();
        if (!$user) {
            return response([
                'message'   => __('auth.unauthorized'),
                'status'    => false,
            ], 401);
        }
        $data = $this->airtimeService->readAirtimeHistory($id);
        if (!$data) {

            return response([
                'message'   => __('app.data_retrieved_failed'),
                'status'    => true,
            ], 404);
        }
        return response([
            'success' => true,
            'message' => __('app.data_retrieved_successfully'),
            'result' => ['data' => $data]
        ]);
    }


    public function getMyBillHistories(Request $request)
    {
        $user = Auth::user();
        return response([
            'message' => __('app.data_retrieved_successfully'),
            'success' => true,
            'results' => [
                'data' => $this->cablebillService->getUserBillHistory($user->id),
            ],
        ]);
    }
    public function billDetails($id)
    {

        $user = Auth::user();
        if (!$user) {
            return response([
                'message'   => __('auth.unauthorized'),
                'status'    => false,
            ], 401);
        }
        $data = $this->cablebillService->readBilllHistory($id);
        if (!$data) {

            return response([
                'message'   => __('app.data_retrieved_failed'),
                'status'    => true,
            ], 404);
        }
        return response([
            'success' => true,
            'message' => __('app.data_retrieved_successfully'),
            'result' => ['data' => $data]
        ]);
    }

    public function getMyCableHistories(Request $request)
    {
        $user = Auth::user();
        return response([
            'message' => __('app.data_retrieved_successfully'),
            'success' => true,
            'results' => [
                'data' => $this->cablebillService->getUserCableHistory($user->id),
            ],
        ]);
    }
    public function cableDetails($id)
    {

        $user = Auth::user();
        if (!$user) {
            return response([
                'message'   => __('auth.unauthorized'),
                'status'    => false,
            ], 401);
        }
        $data = $this->cablebillService->readCableHistory($id);
        if (!$data) {

            return response([
                'message'   => __('app.data_retrieved_failed'),
                'status'    => true,
            ], 404);
        }
        return response([
            'success' => true,
            'message' => __('app.data_retrieved_successfully'),
            'result' => ['data' => $data]
        ]);
    }



}
