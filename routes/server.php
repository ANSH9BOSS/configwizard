<?php

use Illuminate\Support\Facades\Route;
use Pterodactyl\BlueprintFramework\Extensions\configwizard\ConfigWizardController;

Route::get('/{server}/configs', [ConfigWizardController::class, 'getConfigs']);
Route::post('/{server}/apply', [ConfigWizardController::class, 'applyConfigs']);
