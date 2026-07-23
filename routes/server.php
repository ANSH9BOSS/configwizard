<?php

use Illuminate\Support\Facades\Route;
use Pterodactyl\Http\Controllers\Extensions\configwizard\ConfigWizardController;

Route::group([
    'prefix' => '/api/client/servers/{server}/extensions/configwizard',
    'middleware' => ['web', 'auth', 'client-api', 'server'],
], function () {
    Route::get('/configs', [ConfigWizardController::class, 'getConfigs']);
    Route::post('/save', [ConfigWizardController::class, 'saveConfigs']);
    Route::post('/preset', [ConfigWizardController::class, 'applyPreset']);
});
