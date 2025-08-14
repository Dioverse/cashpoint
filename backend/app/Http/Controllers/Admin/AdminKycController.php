<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminKycController extends Controller
{
    //

    public function index()
    {
        $kycs = KycVerification::with('user')->latest()->paginate(20);
        return view('admin.kycs.index', compact('kycs'));
    }

    public function show(KycVerification $kyc)
    {
        return view('admin.kycs.show', compact('kyc'));
    }

    public function approve(KycVerification $kyc)
    {
        $kyc->update([
            'status' => 'approved',
            'admin_note' => 'Approved by Admin ID ' . auth()->id(),
        ]);

        // Notify user if needed
        // $kyc->user->notify(new KycApprovedNotification());

        return back()->with('success', 'KYC approved.');
    }

    public function reject(Request $request, KycVerification $kyc)
    {
        $request->validate([
            'admin_note' => 'required|string|max:255',
        ]);

        $kyc->update([
            'status' => 'rejected',
            'admin_note' => $request->admin_note,
        ]);

        // Notify user if needed
        // $kyc->user->notify(new KycRejectedNotification($request->admin_note));

        return back()->with('error', 'KYC rejected.');
    }
    
}
