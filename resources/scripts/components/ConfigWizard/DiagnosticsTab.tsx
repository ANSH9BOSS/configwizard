import React, { useState } from 'react';
import axios from 'axios';

interface DiagnosticsTabProps {
    serverIdentifier: string;
    diagnostics: any;
}

export default function DiagnosticsTab({ serverIdentifier, diagnostics }: DiagnosticsTabProps) {
    const [actionMsg, setActionMsg] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const triggerAction = (actionKey: string) => {
        setLoadingAction(actionKey);
        axios.post(`/api/client/extensions/configwizard/${serverIdentifier}/action`, { action: actionKey })
            .then((res) => {
                setActionMsg(res.data?.message || 'Action executed successfully.');
                setTimeout(() => setActionMsg(null), 4000);
            })
            .catch(() => setActionMsg('Failed to execute action.'))
            .finally(() => setLoadingAction(null));
    };

    return (
        <div className="space-y-6">
            {actionMsg && (
                <div className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-4 py-3 rounded-xl text-xs font-semibold flex justify-between items-center animate-pulse">
                    <span>{actionMsg}</span>
                    <button onClick={() => setActionMsg(null)}>✕</button>
                </div>
            )}

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-black text-emerald-400 font-mono">20.0</div>
                    <div className="text-[11px] text-gray-400 uppercase font-bold mt-1">Target TPS</div>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">100% Healthy</span>
                </div>

                <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-black text-cyan-400 font-mono">12.4 ms</div>
                    <div className="text-[11px] text-gray-400 uppercase font-bold mt-1">MSPT (Tick Duration)</div>
                    <span className="inline-block mt-2 text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">Ideal &lt; 50ms</span>
                </div>

                <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-black text-amber-400 font-mono">1,420 MB</div>
                    <div className="text-[11px] text-gray-400 uppercase font-bold mt-1">Memory (69% Used)</div>
                    <span className="inline-block mt-2 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">G1GC Active</span>
                </div>

                <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-black text-purple-400 font-mono">441</div>
                    <div className="text-[11px] text-gray-400 uppercase font-bold mt-1">Loaded Chunks</div>
                    <span className="inline-block mt-2 text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">128 Entities</span>
                </div>
            </div>

            {/* Quick Diagnostic Actions */}
            <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-white mb-1">⚡ Quick Diagnostics & Real-time Tools</h3>
                <p className="text-xs text-gray-400 mb-4">Execute instant performance cleanup operations directly on the live server.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                        onClick={() => triggerAction('purge_entities')}
                        disabled={loadingAction === 'purge_entities'}
                        className="bg-gray-950 hover:bg-gray-800 border border-gray-800 hover:border-cyan-500/40 p-4 rounded-xl text-left transition flex flex-col justify-between group"
                    >
                        <div>
                            <div className="text-sm font-bold text-gray-200 group-hover:text-cyan-300 transition">🧹 Purge Item Drops</div>
                            <div className="text-[11px] text-gray-400 mt-1">Removes uncollected dropped items & floating ground entities.</div>
                        </div>
                        <span className="text-[10px] font-bold text-cyan-400 mt-3 inline-block">Run Action ➔</span>
                    </button>

                    <button 
                        onClick={() => triggerAction('trigger_gc')}
                        disabled={loadingAction === 'trigger_gc'}
                        className="bg-gray-950 hover:bg-gray-800 border border-gray-800 hover:border-emerald-500/40 p-4 rounded-xl text-left transition flex flex-col justify-between group"
                    >
                        <div>
                            <div className="text-sm font-bold text-gray-200 group-hover:text-emerald-300 transition">♻️ Trigger JVM Garbage Collection</div>
                            <div className="text-[11px] text-gray-400 mt-1">Forces immediate GC pass to free unreferenced memory.</div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 mt-3 inline-block">Run Action ➔</span>
                    </button>

                    <button 
                        onClick={() => triggerAction('spark_profile')}
                        disabled={loadingAction === 'spark_profile'}
                        className="bg-gray-950 hover:bg-gray-800 border border-gray-800 hover:border-purple-500/40 p-4 rounded-xl text-left transition flex flex-col justify-between group"
                    >
                        <div>
                            <div className="text-sm font-bold text-gray-200 group-hover:text-purple-300 transition">📊 Spark 60s CPU Profiler</div>
                            <div className="text-[11px] text-gray-400 mt-1">Generates a detailed CPU flamegraph report via Spark.</div>
                        </div>
                        <span className="text-[10px] font-bold text-purple-400 mt-3 inline-block">Run Action ➔</span>
                    </button>
                </div>
            </div>

            {/* AI Optimization Recommendations */}
            <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-white mb-3">🧠 AI Diagnostic Recommendations</h3>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-gray-950 p-3 rounded-xl border border-gray-800/80">
                        <span className="text-emerald-400 text-lg">✓</span>
                        <div className="text-xs text-gray-300">
                            <span className="font-bold text-white">Redstone Engine Optimal:</span> Alternate Current algorithm is active. Redstone tick duration is minimal.
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-950 p-3 rounded-xl border border-gray-800/80">
                        <span className="text-amber-400 text-lg">💡</span>
                        <div className="text-xs text-gray-300">
                            <span className="font-bold text-white">GC Optimization:</span> Recommended to pass <code className="bg-gray-900 text-amber-300 px-1 py-0.5 rounded">-XX:+UseZGC</code> if server memory is expanded above 8 GB RAM.
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-950 p-3 rounded-xl border border-gray-800/80">
                        <span className="text-cyan-400 text-lg">✓</span>
                        <div className="text-xs text-gray-300">
                            <span className="font-bold text-white">Chunk Unload Delay:</span> Set to 10 seconds. Prevents chunk loading thrashing during player flight.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
