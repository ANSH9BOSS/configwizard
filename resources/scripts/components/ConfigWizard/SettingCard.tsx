import React from 'react';

interface SettingCardProps {
    name: string;
    title: string;
    category: string;
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    value: string;
    recommended: string;
    onChange?: (name: string, value: string) => void;
}

export default function SettingCard({
    name,
    title,
    category,
    impact,
    description,
    value,
    recommended,
    onChange
}: SettingCardProps) {
    const impactColor = 
        impact === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
        impact === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
        'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

    const categoryColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';

    const isOptimal = value === recommended;

    return (
        <div className="bg-gray-800/80 backdrop-blur border border-gray-700/60 rounded-xl p-5 hover:border-cyan-500/50 transition-all duration-200 shadow-lg flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${categoryColor}`}>
                        {category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${impactColor}`}>
                        {impact} IMPACT
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-100 mb-1">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">{description}</p>
            </div>

            <div className="pt-3 border-t border-gray-700/50 flex items-center justify-between gap-3">
                <div className="flex-1">
                    <label className="text-[11px] text-gray-400 block mb-1">Setting Value (`{name}`):</label>
                    <input 
                        type="text"
                        value={value}
                        onChange={(e) => onChange && onChange(name, e.target.value)}
                        className="w-full bg-gray-900/90 border border-gray-700 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-sm text-cyan-300 font-mono focus:outline-none transition"
                    />
                </div>

                <div className="text-right flex flex-col justify-end">
                    <span className="text-[10px] text-gray-400 block">Recommended</span>
                    <button 
                        type="button"
                        onClick={() => onChange && onChange(name, recommended)}
                        disabled={isOptimal}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md transition ${
                            isOptimal 
                                ? 'bg-emerald-500/10 text-emerald-400 cursor-default' 
                                : 'bg-cyan-600/20 text-cyan-300 hover:bg-cyan-500/30 cursor-pointer'
                        }`}
                    >
                        {isOptimal ? '✓ Optimal' : `Set ${recommended}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
