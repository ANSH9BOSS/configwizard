<?php

use Illuminate\Support\Facades\Route;
use Pterodactyl\BlueprintFramework\Extensions\configwizard\ConfigWizardController;

Route::get('/api/client/servers/{server}/extensions/configwizard/configs', [ConfigWizardController::class, 'getConfigs']);
Route::post('/api/client/servers/{server}/extensions/configwizard/apply', [ConfigWizardController::class, 'applyConfigs']);
