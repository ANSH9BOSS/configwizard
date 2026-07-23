import React from 'react';

interface DiffModalProps {
    onClose: () => void;
}

export default function DiffModal({ onClose }: DiffModalProps) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full p-6 text-white shadow-xl">
                <h2 className="text-xl font-bold mb-4">🔍 Review Configuration Changes</h2>
                <p className="text-gray-300 text-sm mb-4">The following modifications will be written to your server config files:</p>

                <div className="bg-gray-900 border border-gray-700 rounded p-4 font-mono text-sm space-y-2 mb-6">
                    <div className="text-gray-400"># server.properties</div>
                    <div className="text-red-400">- view-distance=10</div>
                    <div className="text-green-400">+ view-distance=6</div>
                    <div className="text-red-400">- simulation-distance=10</div>
                    <div className="text-green-400">+ simulation-distance=5</div>
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            alert('Configuration changes saved!');
                            onClose();
                        }}
                        className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-semibold transition"
                    >
                        Confirm & Save
                    </button>
                </div>
            </div>
        </div>
    );
}
