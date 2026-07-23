import React from 'react';

interface PresetSelectorProps {
    onSelect: (preset: string) => void;
}

export default function PresetSelector({ onSelect }: PresetSelectorProps) {
    return (
        <select 
            onChange={(e) => onSelect(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-2 outline-none cursor-pointer hover:border-gray-600 transition"
        >
            <option value="">-- Apply Preset --</option>
            <option value="performance">⚡ Maximum Performance (Optimized TPS)</option>
            <option value="vanilla">🎯 Vanilla Experience (Default settings)</option>
            <option value="creative">🏗️ Creative / Build Server (High render distance)</option>
            <option value="pvp">⚔️ Low Latency PvP Server</option>
        </select>
    );
}
