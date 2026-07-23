import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ServerContext } from '@/state/server';
import SettingCard from './SettingCard';
import PresetSelector from './PresetSelector';
import DiffModal from './DiffModal';

interface ConfigState {
    [key: string]: any;
}

export default function ConfigWizardContainer() {
    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const serverIdentifier = id || uuid;

    const [loading, setLoading] = useState(true);
    const [configs, setConfigs] = useState<ConfigState>({
        'server.properties': { parsed: { 'view-distance': '8', 'simulation-distance': '6' } },
        'spigot.yml': { parsed: { 'mob-spawn-range': '6' } },
        'paper-global.yml': { parsed: { 'redstone-implementation': 'ALTERNATE_CURRENT' } }
    });
    const [activePreset, setActivePreset] = useState<string | null>(null);
    const [showDiff, setShowDiff] = useState(false);

    useEffect(() => {
        if (!serverIdentifier) return;
        axios.get(`/api/client/servers/${serverIdentifier}/extensions/configwizard/configs`)
            .then((res) => {
                if (res.data?.data) {
                    setConfigs(res.data.data);
                }
            })
            .catch((err) => console.error('ConfigWizard API error:', err))
            .finally(() => setLoading(false));
    }, [serverIdentifier]);

    if (loading) {
        return (
            <div className="my-4 bg-gray-900 p-6 rounded-lg text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-2"></div>
                <p>Loading ConfigWizard Settings...</p>
            </div>
        );
    }

    return (
        <div className="my-4 bg-gray-900 p-6 rounded-lg text-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">🧙‍♂️ ConfigWizard</h1>
                    <p className="text-gray-400 text-sm">Guided Minecraft configuration & performance optimizer by ANSH9BOSS</p>
                </div>
                <div className="flex gap-3">
                    <PresetSelector onSelect={(preset) => setActivePreset(preset)} />
                    <button 
                        onClick={() => setShowDiff(true)}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-semibold transition"
                    >
                        Review & Apply Changes
                    </button>
                </div>
            </div>

            {/* Config Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingCard
                    name="view-distance"
                    title="View Distance"
                    category="Performance"
                    impact="HIGH"
                    description="Controls chunk rendering radius around players. High values drastically increase RAM & CPU usage."
                    value={configs['server.properties']?.parsed?.['view-distance'] || '8'}
                    recommended="6"
                />
                <SettingCard
                    name="simulation-distance"
                    title="Simulation Distance"
                    category="Performance"
                    impact="HIGH"
                    description="Distance around players where entity ticking occurs."
                    value={configs['server.properties']?.parsed?.['simulation-distance'] || '6'}
                    recommended="4"
                />
                <SettingCard
                    name="mob-spawn-range"
                    title="Mob Spawn Range"
                    category="Entities"
                    impact="MEDIUM"
                    description="Sets maximum mob spawn radius (in chunks) from players."
                    value={configs['spigot.yml']?.parsed?.['mob-spawn-range'] || '6'}
                    recommended="4"
                />
                <SettingCard
                    name="redstone-implementation"
                    title="Redstone Engine"
                    category="Tick Rate"
                    impact="HIGH"
                    description="Alternate Current speeds up complex redstone contraptions with zero lag spikes."
                    value={configs['paper-global.yml']?.parsed?.['redstone-implementation'] || 'ALTERNATE_CURRENT'}
                    recommended="ALTERNATE_CURRENT"
                />
            </div>

            {showDiff && <DiffModal onClose={() => setShowDiff(false)} />}
        </div>
    );
}
