import { useState, useEffect } from "react";
import { AlignLeft } from "lucide-react";

interface CardDescriptionProps {
    initialDescription: string;
    onSaveDescription: (desc: string) => Promise<void>;
}

export default function CardDescription({
    initialDescription,
    onSaveDescription
}: CardDescriptionProps) {
    const [description, setDescription] = useState(initialDescription || "");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isEditing) {
            setDescription(initialDescription || "");
        }
    }, [initialDescription, isEditing]);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            await onSaveDescription(description);
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setDescription(initialDescription || "");
        setIsEditing(false);
    };

    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 text-gray-500"><AlignLeft size={20} /></div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                </div>
                <textarea 
                    value={description}
                    disabled={isSaving}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        setIsEditing(true);
                    }}
                    onFocus={() => setIsEditing(true)}
                    className="w-full silver-input text-gray-800 rounded-lg p-3 text-sm min-h-[100px] transition resize-y focus:outline-none disabled:opacity-50"
                    placeholder="Add a more detailed description..."
                />
                {isEditing && (
                    <div className="flex items-center gap-2 mt-2">
                        <button
                             onClick={handleSave}
                             disabled={isSaving}
                             className="silver-btn text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-3 py-1.5 transition cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
