<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillPricingResources extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id'            => $this->id,
            'networkId'     => $this->network_id,
            'planName'      => $this->plan_name,
            'smeplugPlanId' => $this->smeplug_plan_id,
            'buyPrice'      => $this->buy_price,
            'sellPrice'     => $this->price,
            'size'          => $this->size,
            'sizeInMb'      => $this->size_in_mb,
            'validity'      => $this->validity,
            'isActive'      => $this->is_active,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at
        ];
    }
}
