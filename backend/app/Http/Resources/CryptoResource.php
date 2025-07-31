<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CryptoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $request->id,
            'name'              => $request->name,
            'symbol'            => $request->symbol,
            'usd_rate'          => $request->usd_rate,
            'logo'              => $request->logo,
            'chain'             => $request->chain,
            'nownode_ticker'    => $request->nownode_ticker,
            'is_active'         => $request->is_active,
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
        ];
    }
}
