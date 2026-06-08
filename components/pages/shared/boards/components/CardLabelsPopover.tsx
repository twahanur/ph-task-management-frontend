import { useState } from "react";
import { Tag, X, Check, Plus, Loader2 } from "lucide-react";

interface Label {
    id: string;
    name: string;
    color: string;
}

interface CardLabelsPopoverProps {
    boardLabels: Label[];
    cardLabels: Label[];
    onAssignLabel: (labelId: string) => Promise<void>;
    onUnassignLabel: (labelId: string) => Promise<void>;
    onCreateLabel: (name: string, color: string) => Promise<void>;
}

const PRESET_COLORS = [
    "#dc2626", // red
    "#ea580c", // orange
    "#d97706", // amber
    "#16a34a", // green
    "#0891b2", // cyan
    "#2563eb", // blue
    "#7c3aed", // violet
    "#db2777", // pink
    "#64748b", // slate
    "#0d9488", // teal
];

export default function CardLabelsPopover({
    boardLabels,
    cardLabels,
    onAssignLabel,
    onUnassignLabel,
    onCreateLabel,
}: CardLabelsPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newLabelName, setNewLabelName] = useState("");
    const [newLabelColor, setNewLabelColor] = useState(PRESET_COLORS[0]);
    const [isSavingLabel, setIsSavingLabel] = useState(false);
    const [loadingLabelId, setLoadingLabelId] = useState<string | null>(null);

    const isAssigned = (labelId: string) =>
        cardLabels?.some((l) => l.id === labelId);

    const handleToggle = async (labelId: string) => {
        if (loadingLabelId) return;
        setLoadingLabelId(labelId);
        try {
            if (isAssigned(labelId)) {
                await onUnassignLabel(labelId);
            } else {
                await onAssignLabel(labelId);
            }
        } finally {
            setLoadingLabelId(null);
        }
    };

    const handleCreate = async () => {
        if (!newLabelName.trim() || isSavingLabel) return;
        setIsSavingLabel(true);
        try {
            await onCreateLabel(newLabelName.trim(), newLabelColor);
            setNewLabelName("");
            setNewLabelColor(PRESET_COLORS[0]);
            setIsCreating(false);
        } finally {
            setIsSavingLabel(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 silver-btn px-3 py-1.5 rounded text-sm transition cursor-pointer"
            >
                <Tag size={16} /> Labels
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 silver-metallic border border-gray-300 rounded-xl shadow-xl z-30 py-2">
                    {/* Header */}
                    <div className="px-3 pb-2 mb-1 border-b border-gray-200 flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-gray-700">Labels</h4>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Existing Labels List */}
                    <div className="max-h-52 overflow-y-auto custom-scrollbar px-2 space-y-1">
                        {boardLabels.length === 0 && !isCreating && (
                            <p className="text-gray-500 text-xs px-2 py-2 text-center">
                                No labels yet. Create one below.
                            </p>
                        )}
                        {boardLabels.map((label) => {
                            const assigned = isAssigned(label.id);
                            const loading = loadingLabelId === label.id;
                            return (
                                <button
                                    key={label.id}
                                    onClick={() => handleToggle(label.id)}
                                    disabled={!!loadingLabelId}
                                    className="w-full flex items-center gap-2.5 text-left hover:bg-gray-200/50 p-1.5 rounded transition cursor-pointer disabled:opacity-60 group"
                                >
                                    {/* Color pill */}
                                    <span
                                        className="flex-shrink-0 h-6 w-10 rounded"
                                        style={{ backgroundColor: label.color }}
                                    />
                                    <span className="text-xs text-gray-850 flex-1 truncate font-medium">
                                        {label.name}
                                    </span>
                                    <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                        {loading ? (
                                            <Loader2 size={12} className="animate-spin text-gray-500" />
                                        ) : assigned ? (
                                            <Check size={13} className="text-gray-700" />
                                        ) : null}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Create Label Form */}
                    {isCreating ? (
                        <div className="px-2 pt-2 mt-1 border-t border-gray-200 space-y-2">
                            <input
                                type="text"
                                value={newLabelName}
                                onChange={(e) => setNewLabelName(e.target.value)}
                                placeholder="Label name..."
                                autoFocus
                                className="w-full silver-input text-gray-850 text-xs rounded-lg p-2 focus:outline-none transition"
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            />
                            {/* Color Picker */}
                            <div className="flex flex-wrap gap-1.5">
                                {PRESET_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setNewLabelColor(c)}
                                        className="w-6 h-6 rounded cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
                                        style={{ backgroundColor: c }}
                                        title={c}
                                    >
                                        {newLabelColor === c && (
                                            <Check size={12} className="text-white drop-shadow" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewLabelName("");
                                    }}
                                    className="flex-1 text-xs text-gray-500 hover:text-gray-800 border border-gray-300 rounded-lg py-1.5 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreate}
                                    disabled={!newLabelName.trim() || isSavingLabel}
                                    className="flex-1 silver-btn text-xs font-bold py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
                                >
                                    {isSavingLabel ? (
                                        <Loader2 size={12} className="animate-spin" />
                                    ) : (
                                        "Create"
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="px-2 pt-2 mt-1 border-t border-gray-200">
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-200/50 py-1.5 rounded-lg transition cursor-pointer font-semibold"
                            >
                                <Plus size={13} /> Create a new label
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
