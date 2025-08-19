<?php
namespace App\Services;

use App\Models\Network;

class NetworkService
{
    // List all network
    public function allNetworks(): array
    {
        return Network::all()->toArray();
    }

    // Create a new network
    public function createNetwork(array $data): Network
    {
        return Network::create($data);
    }

    // Find a network by ID
    public function findNetworkById(string $id): ?Network
    {
        return Network::find($id);
    }

    // Update a network by ID
    public function updateNetwork(string $id, array $data): ?Network
    {
        $network = $this->findNetworkById($id);
        if ($network) {
            $network->update($data);
            return $network;
        }
        return null;
    }

    // Delete a network by ID
    public function deleteNetwork(string $id): bool
    {
        $network = $this->findNetworkById($id);
        if ($network) {
            $network->delete();
            return true;
        }
        return false;
    }

}
