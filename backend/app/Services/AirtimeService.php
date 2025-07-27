<?php
namespace App\Services;

use App\Models\AirtimeHistory;
use App\Models\AirtimePercentage;
use Illuminate\Support\Facades\Http;

class AirtimeService
{
    // Airtime percentage goes ..........................
    public function getAirtimePercentages()
    {
        return AirtimePercentage::all();
    }

    public function getAirtimePercentage($networkId)
    {
        return AirtimePercentage::where('network_id', $networkId)->first();
    }

    public function createPercentage(array $data)
    {
        return AirtimePercentage::create($data);
    }

    public function updatePercentage(AirtimePercentage $percentage, array $data)
    {
        return $percentage->update($data);
    }

    // Airtime History goes ........................................................
    public function allAirtimeHistory($networkId)
    {
        return AirtimeHistory::all();
    }

    public function createAirtimeHistory(array $data)
    {
        return AirtimeHistory::create($data);
    }

    public function updateAirtimeHistory(AirtimeHistory $airtimeHistory, array $data)
    {
        return $airtimeHistory->update($data);
    }

    public function getUserAirtimeHistory($userId)
    {
        return AirtimeHistory::where('user_id', $userId)->get();
    }

    public function readAirtimeHistory($id)
    {
        return AirtimeHistory::find($id);
    }

    public function getNetworkAirtimeHistory($networkId)
    {
        return AirtimeHistory::where('network_id', $networkId)->get();
    }

    public function getAirtimeHistory($id)
    {
        return AirtimeHistory::find($id);
    }


}
