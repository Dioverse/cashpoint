<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CablePricingResources extends JsonResource
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
            'cableId'       => $this->cable_id,
            'name'          => $this->name,
            'code'          => $this->code,
            'buyPrice'      => $this->buy_price,
            'amount'        => $this->amount,
            'isActive'      => $this->is_active,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at
        ];
    }
}
