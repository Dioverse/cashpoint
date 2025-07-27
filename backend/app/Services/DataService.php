<?php
namespace App\Services;
use App\Models\DataPrice;
use App\Models\DataHistory;
use Illuminate\Support\Facades\Http;

class DataService
{
    // Data Plans goes .....................................
    public function getDataPlans()
    {
        return DataPrice::all();
    }

    public function getDataPlansActive()
    {
        return DataPrice::where('is_active', true)->get();
    }


    public function getDataPlansByNetwork($networkId)
    {
        return DataPrice::where('network_id', $networkId)->get();
    }


    public function createPercentage(array $data)
    {
        return DataPrice::create($data);
    }

    public function updatePercentage(DataPrice $percentage, array $data)
    {
        return $percentage->update($data);
    }

    public function findDataPlan($planId)
    {
        return DataPrice::find($planId);
    }

    // Data History goes ........................................................
    public function allDataHistory($networkId)
    {
        return DataHistory::all();
    }

    public function createDataHistory(array $data)
    {
        return DataHistory::create($data);
    }

    public function updateDataHistory(DataHistory $DataHistory, array $data)
    {
        return $DataHistory->update($data);
    }

    public function getUserDataHistory($userId)
    {
        return DataHistory::where('user_id', $userId)->get();
    }

    public function readDataHistory($id)
    {
        return DataHistory::find($id);
    }

    public function getNetworkDataHistory($networkId)
    {
        return DataHistory::where('network_id', $networkId)->get();
    }

    public function getDataHistory($id)
    {
        return DataHistory::find($id);
    }
}
