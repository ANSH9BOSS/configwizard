@extends('layouts.admin')

@section('title')
    ConfigWizard
@endsection

@section('content-header')
    <h1>ConfigWizard <small>Intelligent Minecraft Server Configurator by ANSH9BOSS</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Extensions</li>
        <li class="active">ConfigWizard</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-xs-12">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">🧙‍♂️ ConfigWizard Extension</h3>
                </div>
                <div class="box-body">
                    <p>ConfigWizard extension by ANSH9BOSS is installed and active on your Pterodactyl panel.</p>
                </div>
            </div>
        </div>
    </div>
@endsection
