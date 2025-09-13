<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class KycService
{
    public function submitKyc(User $user, array $data, array $documents): User
    {
        // Check if user already has pending KYC
        if ($user->kyc_status === 'pending') {
            throw new \Exception('You already have a pending KYC submission.');
        }

        // Upload documents
        $documentPaths = $this->uploadDocuments($documents, $user->id);

        // Update user with KYC data
        $user->update([
            'kyc_tier' => $data['tier'],
            'kyc_status' => 'pending',
            'kyc_rejection' => null, // Clear any previous rejection
            'idmean' => $documentPaths['id_document'] ?? $user->idmean,
            'idtype' => $data['id_type'] ?? $user->idtype,
            'prove_of_fund' => $documentPaths['prove_of_fund'] ?? $user->prove_of_fund,
        ]);

        return $user->fresh();
    }

    public function approveKyc(User $user, string $tier, array $data = [])
    {
        if (!in_array($tier, ['tier2', 'tier3'])) {
            throw new \Exception("Invalid KYC tier");
        }

        $user->update([
            'kyc_tier'       => $tier,
            'kyc_status'     => 'approved',
            'kyc_rejection'  => null,
            'idmean'         => $data['idmean'] ?? $user->idmean,
            'idtype'         => $data['idtype'] ?? $user->idtype,
            'prove_of_fund'  => $data['prove_of_fund'] ?? $user->prove_of_fund,
        ]);

        return $user;
    }

    public function rejectKyc(User $user, $tier, string $reason): User
    {
        $user->update([
            'kyc_tier'       => $tier,
            'kyc_status'     => 'rejected',
            'kyc_rejection'  => $reason,
        ]);

        return $user;
    }

    private function uploadDocuments(array $documents, int $userId): array
    {
        $uploadedPaths = [];
        
        foreach ($documents as $key => $file) {
            if ($file instanceof UploadedFile) {
                // Delete old file if exists
                $oldPath = null;
                if ($key === 'id_document') {
                    $oldPath = User::find($userId)->idmean;
                } elseif ($key === 'prove_of_fund') {
                    $oldPath = User::find($userId)->prove_of_fund;
                }
                
                if ($oldPath && Storage::disk('private')->exists($oldPath)) {
                    Storage::disk('private')->delete($oldPath);
                }

                $path = $file->store("kyc/{$userId}", 'private');
                $uploadedPaths[$key] = $path;
            }
        }
        
        return $uploadedPaths;
    }

    public function canUserTransact(User $user, float $amount): array
    {
        if (!in_array($user->kyc_status, ['approved']))
        {
            return [
                'allowed' => false,
                'reason' => 'KYC verification required or pending',
                'current_tier' => $user->kyc_tier ?? 'tier1',
                'kyc_status' => $user->kyc_status
            ];
        }

        // Reset daily/monthly counters if needed
        $this->resetLimitsIfNeeded($user);

        $dailyRemaining = $user->daily_remaining;
        $monthlyRemaining = $user->monthly_remaining;

        if ($amount > $dailyRemaining) {
            return [
                'allowed' => false,
                'reason' => 'Daily limit exceeded',
                'daily_remaining' => $dailyRemaining,
                'daily_limit' => $user->daily_limit,
                'current_tier' => $user->kyc_tier
            ];
        }

        if ($amount > $monthlyRemaining) {
            return [
                'allowed' => false,
                'reason' => 'Monthly limit exceeded',
                'monthly_remaining' => $monthlyRemaining,
                'monthly_limit' => $user->monthly_limit,
                'current_tier' => $user->kyc_tier
            ];
        }

        return [
            'allowed' => true,
            'daily_remaining' => $dailyRemaining - $amount,
            'monthly_remaining' => $monthlyRemaining - $amount,
            'current_tier' => $user->kyc_tier,
            'daily_limit' => $user->daily_limit,
            'monthly_limit' => $user->monthly_limit
        ];
    }

    public function recordTransaction(User $user, float $amount): void
    {
        $user->increment('daily_spent', $amount);
        $user->increment('monthly_spent', $amount);
    }

    private function resetLimitsIfNeeded(User $user): void
    {
        $today = now()->toDateString();
        $currentMonth = now()->format('Y-m');
        $lastResetMonth = $user->last_reset_date?->format('Y-m');

        $updates = [];

        // Reset daily limit
        if (!$user->last_reset_date || $user->last_reset_date->toDateString() !== $today) {
            $updates['daily_spent'] = 0;
            $updates['last_reset_date'] = $today;
        }

        // Reset monthly limit
        if (!$lastResetMonth || $lastResetMonth !== $currentMonth) {
            $updates['monthly_spent'] = 0;
        }

        if (!empty($updates)) {
            $user->update($updates);
        }
    }

    public function getUserKycData(User $user): array
    {
        return [
            'kyc_tier' => $user->kyc_tier ?? 'tier1',
            'kyc_status' => $user->kyc_status ?? 'none',
            'kyc_rejection' => $user->kyc_rejection,
            'daily_limit' => $user->daily_limit,
            'monthly_limit' => $user->monthly_limit,
            'daily_spent' => $user->daily_spent ?? 0,
            'monthly_spent' => $user->monthly_spent ?? 0,
            'daily_remaining' => $user->daily_remaining,
            'monthly_remaining' => $user->monthly_remaining,
        ];
    }

    public function getTransactionLimit(User $user): int
    {
        $tier = $user->kyc_tier ?? 1;
        $limits = config("kyc.limits");

        return $limits[$tier]['daily_limit'] ?? 0;
    }
}