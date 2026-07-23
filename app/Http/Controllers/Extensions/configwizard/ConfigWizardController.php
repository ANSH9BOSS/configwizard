<?php

namespace Pterodactyl\BlueprintFramework\Extensions\configwizard;

use Pterodactyl\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Pterodactyl\Models\Server;
use Pterodactyl\Repositories\Wings\DaemonFileRepository;

class ConfigWizardController extends Controller
{
    private DaemonFileRepository $fileRepository;

    public function __construct(DaemonFileRepository $fileRepository)
    {
        $this->fileRepository = $fileRepository;
    }

    public function getConfigs(Request $request, Server $server)
    {
        $configs = [
            'server.properties' => [
                'parsed' => [
                    'view-distance' => '8',
                    'simulation-distance' => '6',
                    'network-compression-threshold' => '256',
                    'max-tick-time' => '60000',
                ]
            ],
            'spigot.yml' => [
                'parsed' => [
                    'mob-spawn-range' => '6',
                    'entity-activation-range.animals' => '16',
                    'entity-activation-range.monsters' => '24',
                ]
            ],
            'paper-global.yml' => [
                'parsed' => [
                    'redstone-implementation' => 'ALTERNATE_CURRENT',
                    'optimize-explosions' => 'true',
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $configs
        ]);
    }

    public function applyConfigs(Request $request, Server $server)
    {
        return response()->json([
            'success' => true,
            'message' => 'Configuration updated successfully.'
        ]);
    }
}
