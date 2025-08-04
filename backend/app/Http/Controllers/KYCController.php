<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Http\Request;

class KYCController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $request->validate([
            'address_prove'   => 'required|image|max:2048',
            'fund_prove'      => 'required|image|max:2048',
        ]);

        // Save images
        $addImagePath   = $request->file('address_prove')->store('kyc_phots', 'public');
        $fundPath       = $request->file('fund_prove')->store('kyc_phots', 'public');
        $user           = auth()->user();
        $user->prove_of_address = $addImagePath;
        $user->prove_of_fund    = $fundPath;
        $user->kyc_status       = 'pending';
        $user->save();

        return response()->json([
            'message' => __('auth.kyc_submitted'),
            'status' => true,
            'results' => [
                'data' => $user
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    : Response
    {
        $request->validate([
            'id_type'   => 'required|in:nin,bvn,driver_license,passport',
            'photo'     => 'required|image|max:2048|mimetypes:image/jpeg,image/png',
        ]);

        $path           = $request->file('photo')->store('kyc_photos', 'public');
        $user           = auth()->user();
        $user->idtype   = $request->id_type;
        // $user->kyc_tier = 'tier2';
        $user->kyc_status= 'pending';
        $user->idmean   = $path;
        $user->save();


        return response([
            'message' => __('auth.kyc_submitted'),
            'status' => true
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function submitKYC(Request $request)
    {
        $request->validate([
            'id_type' => 'required|string',
            'id_image' => 'required|image|max:2048',
            'selfie_image' => 'required|image|max:2048',
        ]);

        // Save images
        $idImagePath = $request->file('id_image')->store('kyc/id', 'public');
        $selfiePath = $request->file('selfie_image')->store('kyc/selfie', 'public');

        // (Optional) Send both images to a Face Match API
        $matchScore = $this->checkFaceMatch($idImagePath, $selfiePath);

        $kyc = KycVerification::create([
            'user_id' => auth()->id(),
            'id_type' => $request->id_type,
            'id_image' => $idImagePath,
            'selfie_image' => $selfiePath,
            'match_score' => $matchScore,
            'status' => $matchScore >= 80 ? 'pending' : 'rejected',
        ]);

        return response()->json([
            'message' => 'KYC submitted',
            'match_score' => $matchScore,
            'status' => $kyc->status,
        ]);
    }
}
