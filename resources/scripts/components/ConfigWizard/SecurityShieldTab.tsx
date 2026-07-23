import React, { useState } from 'react';

export default function SecurityShieldTab() {
    const [enabledExploits, setEnabledExploits] = useState<{ [key: string]: boolean }>({
        packet_limiter: true,
        sign_nbt_cap: true,
        book_dupe_patch: true,
        enderpearl_cooldown: true,
        illegal_stack_cleaner: true,
    });

    const toggleExploit = (key: string) => {
        setEnabledExploits((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-950/40 via-gray-900 to-gray-900 border border-red-500/20 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    🛡️ Security & Anti-Exploit Shield
                </h2>
                <p className="text-xs text-gray-400">
                    Protect your server against chunk-dupes, packet exploits, book crashes, and malformed NBT data attacks.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-white">Netty Packet Rate Limiter</h4>
                        <p className="text-xs text-gray-400 mt-1">Drops malformed network packets exceeding 500 pkg/sec.</p>
                    </div>
                    <button 
                        onClick={() => toggleExploit('packet_limiter')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            enabledExploits['packet_limiter'] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'
                        }`}
                    >
                        {enabledExploits['packet_limiter'] ? 'ACTIVE' : 'DISABLED'}
                    </button>
                </div>

                <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-white">Sign NBT Text Length Cap</h4>
                        <p className="text-xs text-gray-400 mt-1">Limits sign text payload to prevent client-crashing signs.</p>
                    </div>
                    <button 
                        onClick={() => toggleExploit('sign_nbt_cap')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            enabledExploits['sign_nbt_cap'] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'
                        }`}
                    >
                        {enabledExploits['sign_nbt_cap'] ? 'ACTIVE' : 'DISABLED'}
                    </button>
                </div>

                <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-white">Book & Quill Dupe Patch</h4>
                        <p className="text-xs text-gray-400 mt-1">Sanitizes page payload data before writing to inventory.</p>
                    </div>
                    <button 
                        onClick={() => toggleExploit('book_dupe_patch')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            enabledExploits['book_dupe_patch'] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'
                        }`}
                    >
                        {enabledExploits['book_dupe_patch'] ? 'ACTIVE' : 'DISABLED'}
                    </button>
                </div>

                <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-white">Enderpearl Teleport Phase Shield</h4>
                        <p className="text-xs text-gray-400 mt-1">Prevents clipping through bedrock or claim boundaries.</p>
                    </div>
                    <button 
                        onClick={() => toggleExploit('enderpearl_cooldown')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            enabledExploits['enderpearl_cooldown'] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'
                        }`}
                    >
                        {enabledExploits['enderpearl_cooldown'] ? 'ACTIVE' : 'DISABLED'}
                    </button>
                </div>
            </div>
        </div>
    );
}
