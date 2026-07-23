import React from 'react';

interface PresetSelectorProps {
    onSelect: (preset: string) => void;
    activePreset: string | null;
}

export default function PresetSelector({ onSelect, activePreset }: PresetSelectorProps) {
    const presets = [
        { id: 'max_performance', label: '⚡ Max Performance', color: 'from-amber-500 to-red-600' },
        { id: 'balanced', label: '⚖️ Balanced', color: 'from-cyan-500 to-blue-600' },
        { id: 'vanilla', label: '🎮 Vanilla Default', color: 'from-gray-600 to-slate-700' },
    ];

    return (
        <div className="flex items-center gap-2 bg-gray-900/80 p-1.5 rounded-xl border border-gray-700/80">
            {presets.map((p) => (
                <button
                    key={p.id}
                    onClick={() => onSelect(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activePreset === p.id 
                            ? `bg-gradient-to-r ${p.color} text-white shadow-md shadow-cyan-500/10` 
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
}
