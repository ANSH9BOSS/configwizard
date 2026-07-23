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
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const [loading, setLoading] = useState(true);
    const [configs, setConfigs] = useState<ConfigState>({});
    const [activePreset, setActivePreset] = useState<string | null>(null);
    const [showDiff, setShowDiff] = useState(false);

    useEffect(() => {
        if (!uuid) return;
        axios.get(`/api/client/servers/${uuid}/extensions/configwizard/configs`)
            .then((res) => {
                setConfigs(res.data.data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [uuid]);

    if (loading) return <div className="p-4 text-white">Loading ConfigWizard...</div>;

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
                    value={configs['server.properties']?.parsed?.['view-distance'] || '10'}
                    recommended="6"
                />
                <SettingCard
                    name="simulation-distance"
                    title="Simulation Distance"
                    category="Performance"
                    impact="HIGH"
                    description="Controls active ticking distance for entities/redstone. Lower values save TPS."
                    value={configs['server.properties']?.parsed?.['simulation-distance'] || '10'}
                    recommended="5"
                />
            </div>

            {showDiff && <DiffModal onClose={() => setShowDiff(false)} />}
        </div>
    );
}
