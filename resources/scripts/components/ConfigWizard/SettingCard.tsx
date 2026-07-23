import React from 'react';

interface SettingCardProps {
    name: string;
    title: string;
    category: string;
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    value: string;
    recommended: string;
}

export default function SettingCard({ title, category, impact, description, value, recommended }: SettingCardProps) {
    const impactColor = impact === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                         impact === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                         'bg-green-500/20 text-green-400 border-green-500/30';

    return (
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-mono uppercase bg-gray-700 text-gray-300 px-2 py-0.5 rounded mr-2">{category}</span>
                        <h3 className="text-lg font-semibold inline">{title}</h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border font-bold ${impactColor}`}>
                        {impact} IMPACT
                    </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{description}</p>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-400">
                    Recommended: <span className="text-green-400 font-mono font-bold">{recommended}</span>
                </div>
                <input 
                    type="text" 
                    defaultValue={value}
                    className="bg-gray-900 border border-gray-600 rounded px-3 py-1 text-sm font-mono text-white w-24 text-center focus:border-blue-500 outline-none"
                />
            </div>
        </div>
    );
}
