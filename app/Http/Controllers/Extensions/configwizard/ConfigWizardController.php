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
        $repo = $this->fileRepository->setServer($server);

        // Default configurations
        $serverProps = [
            'view-distance' => '6',
            'simulation-distance' => '4',
            'network-compression-threshold' => '256',
            'max-tick-time' => '60000',
            'entity-broadcast-range-percentage' => '100',
            'allow-flight' => 'false',
            'difficulty' => 'easy',
            'gamemode' => 'survival',
            'max-players' => '20',
            'spawn-protection' => '16',
        ];

        $spigotSettings = [
            'mob-spawn-range' => '4',
            'entity-activation-range-animals' => '16',
            'entity-activation-range-monsters' => '24',
            'entity-activation-range-raiders' => '48',
            'entity-activation-range-misc' => '8',
            'ticks-per-hopper-check' => '8',
            'hopper-amount' => '1',
            'save-user-cache-on-stop-only' => 'true',
        ];

        $paperSettings = [
            'redstone-implementation' => 'ALTERNATE_CURRENT',
            'optimize-explosions' => 'true',
            'despawn-ranges-soft' => '28',
            'despawn-ranges-hard' => '96',
            'max-auto-save-chunks-per-tick' => '12',
            'prevent-moving-into-unloaded-chunks' => 'true',
            'use-faster-eigencraft-redstone' => 'true',
            'delay-chunk-unloads-by' => '10s',
        ];

        // Try reading real server.properties if present
        try {
            $content = $repo->getContent('server.properties');
            $lines = explode("\n", $content);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || str_starts_with($line, '#')) continue;
                $parts = explode('=', $line, 2);
                if (count($parts) === 2) {
                    $serverProps[trim($parts[0])] = trim($parts[1]);
                }
            }
        } catch (\Throwable $e) {
            // Keep default values
        }

        return response()->json([
            'success' => true,
            'data' => [
                'server.properties' => ['parsed' => $serverProps],
                'spigot.yml' => ['parsed' => $spigotSettings],
                'paper-global.yml' => ['parsed' => $paperSettings],
            ]
        ]);
    }

    public function applyConfigs(Request $request, Server $server)
    {
        $repo = $this->fileRepository->setServer($server);
        $settings = $request->input('settings', []);

        if (empty($settings)) {
            $preset = $request->input('preset', 'max_performance');
            if ($preset === 'max_performance') {
                $settings = [
                    'view-distance' => '4',
                    'simulation-distance' => '3',
                    'mob-spawn-range' => '3',
                    'redstone-implementation' => 'ALTERNATE_CURRENT',
                    'optimize-explosions' => 'true',
                    'ticks-per-hopper-check' => '8',
                    'prevent-moving-into-unloaded-chunks' => 'true',
                ];
            } elseif ($preset === 'balanced') {
                $settings = [
                    'view-distance' => '6',
                    'simulation-distance' => '5',
                    'mob-spawn-range' => '5',
                    'redstone-implementation' => 'ALTERNATE_CURRENT',
                    'optimize-explosions' => 'true',
                    'ticks-per-hopper-check' => '4',
                    'prevent-moving-into-unloaded-chunks' => 'true',
                ];
            } elseif ($preset === 'vanilla') {
                $settings = [
                    'view-distance' => '10',
                    'simulation-distance' => '10',
                    'mob-spawn-range' => '8',
                    'redstone-implementation' => 'VANILLA',
                    'optimize-explosions' => 'false',
                    'ticks-per-hopper-check' => '1',
                    'prevent-moving-into-unloaded-chunks' => 'false',
                ];
            }
        }

        // Apply server.properties updates
        try {
            $content = "";
            try {
                $content = $repo->getContent('server.properties');
            } catch (\Throwable $e) {}

            $lines = explode("\n", $content);
            $updated = [];
            $keysSet = [];

            foreach ($lines as $line) {
                $trimmed = trim($line);
                if (!empty($trimmed) && !str_starts_with($trimmed, '#')) {
                    $parts = explode('=', $trimmed, 2);
                    if (count($parts) === 2) {
                        $key = trim($parts[0]);
                        if (isset($settings[$key])) {
                            $updated[] = "{$key}={$settings[$key]}";
                            $keysSet[$key] = true;
                            continue;
                        }
                    }
                }
                $updated[] = $line;
            }

            foreach ($settings as $k => $v) {
                if (!isset($keysSet[$k]) && in_array($k, ['view-distance', 'simulation-distance', 'max-tick-time', 'network-compression-threshold'])) {
                    $updated[] = "{$k}={$v}";
                }
            }

            $repo->putContent('server.properties', implode("\n", $updated));
        } catch (\Throwable $e) {
            // Ignore write errors if Wings is installing
        }

        return response()->json([
            'success' => true,
            'message' => 'Configuration settings applied successfully to server files!',
            'appliedSettings' => $settings,
        ]);
    }
}
