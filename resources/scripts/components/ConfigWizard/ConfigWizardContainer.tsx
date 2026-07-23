import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ServerContext } from '@/state/server';
import SettingCard from './SettingCard';
import PresetSelector from './PresetSelector';
import DiffModal from './DiffModal';

interface SettingDef {
    name: string;
    title: string;
    category: 'Performance' | 'Entities' | 'Tick Rate' | 'World' | 'Network';
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    recommended: string;
}

const SETTINGS_CATALOG: SettingDef[] = [
    { name: 'view-distance', title: 'View Distance', category: 'Performance', impact: 'HIGH', description: 'Chunk render radius per player. Lowering saves high RAM/CPU.', recommended: '6' },
    { name: 'simulation-distance', title: 'Simulation Distance', category: 'Performance', impact: 'HIGH', description: 'Entity & block tick radius around players.', recommended: '4' },
    { name: 'mob-spawn-range', title: 'Mob Spawn Range', category: 'Entities', impact: 'MEDIUM', description: 'Chunk radius for mob spawning algorithm.', recommended: '4' },
    { name: 'entity-activation-range-monsters', title: 'Monster Activation', category: 'Entities', impact: 'HIGH', description: 'Distance at which monsters start AI ticking.', recommended: '24' },
    { name: 'entity-activation-range-animals', title: 'Animal Activation', category: 'Entities', impact: 'MEDIUM', description: 'Distance at which passive animals start AI ticking.', recommended: '16' },
    { name: 'redstone-implementation', title: 'Redstone Engine', category: 'Tick Rate', impact: 'HIGH', description: 'Alternate Current removes redstone lag spikes.', recommended: 'ALTERNATE_CURRENT' },
    { name: 'optimize-explosions', title: 'Optimize Explosions', category: 'Tick Rate', impact: 'HIGH', description: 'Fast explosion algorithm for TNT/creepers.', recommended: 'true' },
    { name: 'ticks-per-hopper-check', title: 'Hopper Tick Delay', category: 'World', impact: 'MEDIUM', description: 'Interval between hopper item transfers.', recommended: '8' },
    { name: 'network-compression-threshold', title: 'Net Compression', category: 'Network', impact: 'LOW', description: 'Packet size threshold for zlib compression.', recommended: '256' },
    { name: 'max-tick-time', title: 'Watchdog Timeout', category: 'Tick Rate', impact: 'HIGH', description: 'Max milliseconds a tick can take before crash.', recommended: '60000' },
];

export default function ConfigWizardContainer() {
    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const serverIdentifier = id || uuid;

    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [activePreset, setActivePreset] = useState<string | null>('balanced');
    const [activeCategory, setActiveCategory] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showDiff, setShowDiff] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const [settingsState, setSettingsState] = useState<{ [key: string]: string }>({
        'view-distance': '6',
        'simulation-distance': '4',
        'mob-spawn-range': '4',
        'entity-activation-range-monsters': '24',
        'entity-activation-range-animals': '16',
        'redstone-implementation': 'ALTERNATE_CURRENT',
        'optimize-explosions': 'true',
        'ticks-per-hopper-check': '8',
        'network-compression-threshold': '256',
        'max-tick-time': '60000',
    });

    useEffect(() => {
        if (!serverIdentifier) {
            setLoading(false);
            return;
        }
        axios.get(`/api/client/extensions/configwizard/${serverIdentifier}/configs`)
            .then((res) => {
                if (res.data?.data) {
                    const sp = res.data.data['server.properties']?.parsed || {};
                    const spig = res.data.data['spigot.yml']?.parsed || {};
                    const pap = res.data.data['paper-global.yml']?.parsed || {};

                    setSettingsState((prev) => ({
                        ...prev,
                        ...sp,
                        ...spig,
                        ...pap,
                    }));
                }
            })
            .catch((err) => console.error('ConfigWizard fetch error:', err))
            .finally(() => setLoading(false));
    }, [serverIdentifier]);

    const handleSettingChange = (name: string, val: string) => {
        setSettingsState((prev) => ({ ...prev, [name]: val }));
    };

    const handlePresetSelect = (presetKey: string) => {
        setActivePreset(presetKey);
        if (presetKey === 'max_performance') {
            setSettingsState((prev) => ({
                ...prev,
                'view-distance': '4',
                'simulation-distance': '3',
                'mob-spawn-range': '3',
                'entity-activation-range-monsters': '16',
                'redstone-implementation': 'ALTERNATE_CURRENT',
                'optimize-explosions': 'true',
                'ticks-per-hopper-check': '8',
            }));
        } else if (presetKey === 'balanced') {
            setSettingsState((prev) => ({
                ...prev,
                'view-distance': '6',
                'simulation-distance': '4',
                'mob-spawn-range': '4',
                'entity-activation-range-monsters': '24',
                'redstone-implementation': 'ALTERNATE_CURRENT',
                'optimize-explosions': 'true',
                'ticks-per-hopper-check': '4',
            }));
        } else if (presetKey === 'vanilla') {
            setSettingsState((prev) => ({
                ...prev,
                'view-distance': '10',
                'simulation-distance': '10',
                'mob-spawn-range': '8',
                'entity-activation-range-monsters': '32',
                'redstone-implementation': 'VANILLA',
                'optimize-explosions': 'false',
                'ticks-per-hopper-check': '1',
            }));
        }
    };

    const handleApply = () => {
        setApplying(true);
        axios.post(`/api/client/extensions/configwizard/${serverIdentifier}/apply`, {
            preset: activePreset,
            settings: settingsState,
        })
            .then((res) => {
                setShowDiff(false);
                setToastMessage('✅ Configurations successfully applied to server files!');
                setTimeout(() => setToastMessage(null), 4000);
            })
            .catch((err) => {
                console.error('Apply error:', err);
                setToastMessage('❌ Failed to save configuration changes.');
                setTimeout(() => setToastMessage(null), 4000);
            })
            .finally(() => setApplying(false));
    };

    // Calculate Optimization Score
    let optimalCount = 0;
    SETTINGS_CATALOG.forEach((item) => {
        if (settingsState[item.name] === item.recommended) optimalCount++;
    });
    const healthScore = Math.round((optimalCount / SETTINGS_CATALOG.length) * 100);

    const filteredSettings = SETTINGS_CATALOG.filter((item) => {
        const matchesCat = activeCategory === 'ALL' || item.category.toUpperCase() === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    if (loading) {
        return (
            <div className="my-6 bg-gray-900 border border-gray-800 p-8 rounded-2xl text-white text-center shadow-xl">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto mb-3"></div>
                <p className="text-sm font-semibold text-gray-300">Loading ConfigWizard Engine...</p>
            </div>
        );
    }

    return (
        <div className="my-6 space-y-6">
            {/* Notification Toast */}
            {toastMessage && (
                <div className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between shadow-lg animate-bounce">
                    <span>{toastMessage}</span>
                    <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white">✕</button>
                </div>
            )}

            {/* Premium Header Banner */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                                Native Blueprint Extension
                            </span>
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                20.0 TPS Target
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            🧙‍♂️ ConfigWizard
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">
                            Context-aware Minecraft server configuration assistant by <span className="text-cyan-400 font-semibold">ANSH9BOSS</span>
                        </p>
                    </div>

                    {/* Stats & Optimization Ring */}
                    <div className="flex items-center gap-6 bg-gray-950/80 p-3 px-5 rounded-xl border border-gray-800">
                        <div className="text-center">
                            <div className="text-2xl font-black text-cyan-400 font-mono">{healthScore}%</div>
                            <div className="text-[10px] text-gray-400 uppercase font-semibold">Optimization</div>
                        </div>

                        <div className="h-8 w-px bg-gray-800"></div>

                        <div className="text-center">
                            <div className="text-2xl font-black text-emerald-400 font-mono">20.0</div>
                            <div className="text-[10px] text-gray-400 uppercase font-semibold">Est. TPS</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar: Presets & Search */}
            <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PresetSelector 
                    onSelect={handlePresetSelect}
                    activePreset={activePreset}
                />

                <div className="flex items-center gap-3">
                    <input 
                        type="text"
                        placeholder="Search settings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-950 border border-gray-800 focus:border-cyan-500 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none w-full md:w-56 transition"
                    />

                    <button 
                        onClick={() => setShowDiff(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <span>Review & Save Changes</span>
                    </button>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
                {['ALL', 'PERFORMANCE', 'ENTITIES', 'TICK RATE', 'WORLD', 'NETWORK'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-lg border transition ${
                            activeCategory === cat 
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm' 
                                : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Settings Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSettings.map((setting) => (
                    <SettingCard
                        key={setting.name}
                        name={setting.name}
                        title={setting.title}
                        category={setting.category}
                        impact={setting.impact}
                        description={setting.description}
                        value={settingsState[setting.name] || setting.recommended}
                        recommended={setting.recommended}
                        onChange={handleSettingChange}
                    />
                ))}
            </div>

            {/* Diff Modal */}
            {showDiff && (
                <DiffModal 
                    onClose={() => setShowDiff(false)}
                    onConfirm={handleApply}
                    pendingChanges={settingsState}
                    applying={applying}
                />
            )}
        </div>
    );
}
