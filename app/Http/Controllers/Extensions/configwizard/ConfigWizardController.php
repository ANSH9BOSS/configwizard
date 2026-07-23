<?php

namespace Pterodactyl\Http\Controllers\Extensions\configwizard;

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

    /**
     * Reads all available Minecraft config files on the server.
     */
    public function getConfigs(Request $request, Server $server)
    {
        $filesToRead = [
            'server.properties' => 'properties',
            'spigot.yml' => 'yaml',
            'config/paper-global.yml' => 'yaml',
            'purpur.yml' => 'yaml'
        ];

        $parsedConfigs = [];

        foreach ($filesToRead as $filePath => $type) {
            try {
                $content = $this->fileRepository->setServer($server)->getContent($filePath);
                $parsedConfigs[$filePath] = [
                    'exists' => true,
                    'type' => $type,
                    'content' => $content,
                ];
            } catch (\Exception $e) {
                $parsedConfigs[$filePath] = ['exists' => false];
            }
        }

        return response()->json([
            'success' => true,
            'data' => $parsedConfigs
        ]);
    }

    /**
     * Saves updated configuration files back to the server.
     */
    public function saveConfigs(Request $request, Server $server)
    {
        $validated = $request->validate([
            'files' => 'required|array',
            'files.*.path' => 'required|string',
            'files.*.content' => 'required|string',
        ]);

        foreach ($validated['files'] as $file) {
            $this->fileRepository->setServer($server)->putContent($file['path'], $file['content']);
        }

        return response()->json(['success' => true, 'message' => 'Configuration saved successfully!']);
    }
}
