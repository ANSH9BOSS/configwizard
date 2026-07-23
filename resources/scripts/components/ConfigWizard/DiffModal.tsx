import React from 'react';

interface DiffModalProps {
    onClose: () => void;
    onConfirm: () => void;
    pendingChanges: { [key: string]: string };
    applying: boolean;
}

export default function DiffModal({ onClose, onConfirm, pendingChanges, applying }: DiffModalProps) {
    const entries = Object.entries(pendingChanges);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-2">🔍 Review Pending Configuration Changes</h3>
                <p className="text-xs text-gray-400 mb-4">
                    The following settings will be written directly to your server files (`server.properties`, `spigot.yml`, `paper-global.yml`).
                </p>

                <div className="bg-gray-950 rounded-xl p-4 border border-gray-800 max-h-60 overflow-y-auto mb-6 space-y-2 font-mono text-xs">
                    {entries.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No settings modified.</p>
                    ) : (
                        entries.map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center bg-gray-900/60 p-2 rounded border border-gray-800">
                                <span className="text-cyan-400">{key}</span>
                                <span className="text-emerald-400 font-bold">➔ {val}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={applying}
                        className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
                    >
                        {applying ? (
                            <>
                                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                                Applying...
                            </>
                        ) : 'Confirm & Save to Disk'}
                    </button>
                </div>
            </div>
        </div>
    );
}
