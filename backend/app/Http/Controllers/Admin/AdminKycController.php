<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use App\Services\KycService;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\AuthServices;
use Illuminate\Support\Facades\Auth;

class AdminKycController extends Controller
{
    private $kycService;
    private $authService;

    public function __construct()
    {
        $this->kycService = new KycService();
        $this->authService = new AuthServices();
    }

    public function index(Request $request)
    {
        $query = User::whereIn('kyc_status', ['pending', 'approved', 'rejected']);

        if ($request->has('status')) {
            $query->where('kyc_status', $request->status);
        }

        $users = $query->paginate(20);

        return response([
            'success' => true,
            'message' => 'KYC Users fetched successfully',
            'result' => [
                'users' => $users
            ]
        ]);
    }

    public function show(Request $request, User $user)
    {
        $uid = $request->route('kyc');
        $user = User::where('uuid', $uid)->firstOrFail();

        return response([
            'success' => true,
            'message' => 'KYC User details fetched successfully',
            'result' => [
                'user' => UserResource::make($user)
            ]
        ]);
    }

    public function approve(Request $request)
    {
        $user = $this->authService->findByUuid($request->route('kyc'));
        $request->validate([
            'tier' => 'required|in:2,3',
            'idmean' => 'nullable|string',
            'idtype' => 'nullable|string',
            'prove_of_fund' => 'nullable|string',
        ]);

        if (!in_array($request->tier, ['2', '3'])) {
            return response([
                'success' => false,
                'message' => "Invalid KYC tier",
                "result"=> [
                    'user' => UserResource::make($user)
                ]
            ], 400);
        }

        if ($user->kyc_status === 'approved') {
            return response([
                'success' => false,
                'message' => "KYC is already approved for this user.",
                "result"=> [
                    'user' => UserResource::make($user)
                ]
            ], 400);
        }

        if ($request->tier ==='3' && ($user->prove_of_address === 'null' || $user->prove_of_address === null)) {
            return response([
                'success' => false,
                'message' => "Complete Tier 2 KYC first by providing means of identification.",
                "result"=> [
                    'user' => UserResource::make($user)
                ]
            ], 400);
        }

        $kyc = $this->kycService->approveKyc($user, "tier{$request->tier}", $request->only(['idmean', 'idtype', 'prove_of_fund']));
        // $kyc->user->notify(new KycApprovedNotification());
        return response([
            'success' => true,
            'message' => "KYC Tier {$request->tier} approved",
            "result"=> [
                'user' => UserResource::make($user)
            ]
        ]);
    }


    public function reject(Request $request)
    {
        $user = $this->authService->findByUuid($request->route('kyc'));
        $request->validate([
            'tier'   => 'required|in:2,3',
            'reason' => 'required|string',
        ]);

        if (!in_array($request->tier, ['2', '3'])) {
            return response([
                'success' => false,
                'message' => "Invalid KYC tier",
                "result"=> [
                    'reason'=> $request->reason,
                    'tier'  => $request->tier,
                    'user'  => UserResource::make($user)
                ]
            ], 400);
        }

        $this->kycService->rejectKyc($user, "tier{$request->tier}", $request->reason);

        return response()->json([
            'success' => true,
            'message' => "KYC rejected",
            'user'    => UserResource::make($user)
        ]);
    }

    public function getLimit(User $user)
    {
        $limit = $this->kycService->getTransactionLimit($user);

        return response()->json([
            'user_id' => $user->id,
            'tier'    => $user->kyc_tier,
            'limit'   => $limit,
        ]);
    }

    public function checkTransactionLimit(Request $request): JsonResponse
    {
        $request->validate(['amount' => 'required|numeric|min:0']);
        
        $result = $this->kycService->canUserTransact(
            $request->user(),
            $request->amount
        );

        return response()->json([
            'success' => true,
            'message'=> 'Transaction limit check result',
            'result' => [
                'data' => $result,
            ]
        ]);
    }


    public function recordTransaction(Request $request): JsonResponse
    {
        $request->validate(['amount' => 'required|numeric|min:0']);
        $user = Auth::user();
        
        // First check if transaction is allowed
        $canTransact = $this->kycService->canUserTransact(
            $request->user(),
            $request->amount
        );

        if (!$canTransact['allowed']) {
            return response()->json([
                'success' => false,
                'message' => $canTransact['reason'],
                'result'=> [
                    'data' => $this->kycService->recordTransaction($user, $request->amount),
                    '...' => $user->kyc_status . ' - ' . $user->kyc_tier,
                    'user' => UserResource::make($user)
                ]
            ], 400);
        }

        // Record the transaction
        $this->kycService->recordTransaction($request->user(), $request->amount);

        return response()->json([
            'success' => true,
            'message' => 'Transaction recorded successfully',
            'data' => $this->kycService->getUserKycData($request->user()->fresh())
        ]);
    }
    
}
