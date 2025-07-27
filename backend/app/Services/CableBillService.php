<?php
namespace App\Services;

use App\Models\Bill;
use App\Models\BillHistory;
use App\Models\Cable;
use App\Models\CableHistory;
use App\Models\CablePlan;

class CableBillService {

    public function bills() {
        $bill = Bill::all();
        return $bill;
    }

    public function billsActive() {
        $bill = Bill::where('is_active', true)->get();
        return $bill;
    }

    public function getBill($id) {
        $bill = Bill::find($id);
        return $bill;
    }

    public function createBill($data) {
        return Bill::create($data);
    }

    public function updateBill(Bill $bill, array $data) {
        return $bill->update($data);
    }

    public function cablePlans() {
        return CablePlan::all();
    }

    public function cablePlansActive() {
        return CablePlan::where('is_active', true)->get();
    }


    public function cablePlan($id) {
        return CablePlan::find($id);
    }

    public function findCablePlan($id) {
        return CablePlan::where('code', $id)->first();
    }

    public function plansByCable($id) {
        return CablePlan::where('cable_id', $id)->get();
    }


    // Cables management .........................................

    public function cables() {
        return Cable::all();
    }

    public function cablesActive() {
        return Cable::where('is_active', true)->get();
    }

    public function getCable($id) {
        return Cable::find($id);
    }

    public function createCable($data) {
        return Cable::create($data);
    }

    public function updateCable(Cable $bill, array $data) {
        return $bill->update($data);
    }

    //  Utilities history ................................................................
    // Cable, create, read, and update history ++++++++++++++++++++
    public function createCableHistory(array $data) {
        return CableHistory::create($data);
    }

    public function readCableHistory($id)
    {
        return CableHistory::find($id);
    }

    public function getUserCableHistory($id)
    {
        return CableHistory::where('user_id', $id)->get();
    }

    public function updateCableHistory($id, array $data)
    {
        return CableHistory::find($id)->update($data);
    }

    // Bill, create, read, and update history +++++++++++++++++++++++++++
    public function createBillHistory(array $data) {
        return BillHistory::create($data);
    }

    public function readBilllHistory($id)
    {
        return BillHistory::find($id);
    }

    public function getUserBillHistory($id)
    {
        return BillHistory::where('user_id', $id)->get();
    }

    public function updateBillHistory($id, array $data)
    {
        return BillHistory::find($id)->update($data);
    }



}
