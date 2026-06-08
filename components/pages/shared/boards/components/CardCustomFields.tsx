import { useState, useRef, useEffect } from "react";
import {
    SlidersHorizontal,
    Plus,
    X,
    Check,
    Loader2,
    Hash,
    Type,
    CalendarDays,
    ToggleLeft,
    ChevronDown,
    Pencil,
    Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "number" | "date" | "checkbox" | "dropdown";

export interface CustomField {
    id: string;
    name: string;
    type: FieldType;
    options?: string[];
}

// card values: map of fieldId -> value string
export type CardValuesMap = Record<string, string>;

interface CardCustomFieldsProps {
    /** Board-level field definitions */
    boardCustomFields: CustomField[];
    /** Map of fieldId → value for this card */
    cardValues: CardValuesMap;
    /** Called when user saves a value for a field */
    onSetValue: (fieldId: string, value: string) => Promise<void>;
    /** Called when user creates a new board-level field */
    onCreateField: (name: string, type: FieldType, options: string[]) => Promise<void>;
    /** Called when user deletes a board-level field */
    onDeleteField: (fieldId: string) => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<FieldType, { icon: React.ReactNode; label: string }> = {
    text:     { icon: <Type size={13} />,        label: "Text"     },
    number:   { icon: <Hash size={13} />,        label: "Number"   },
    date:     { icon: <CalendarDays size={13} />, label: "Date"    },
    checkbox: { icon: <ToggleLeft size={13} />,  label: "Checkbox" },
    dropdown: { icon: <ChevronDown size={13} />, label: "Dropdown" },
};

const FIELD_TYPES: FieldType[] = ["text", "number", "date", "checkbox", "dropdown"];

// ─── Inline value editor per field type ──────────────────────────────────────

function FieldValueEditor({
    field,
    currentValue,
    onSave,
}: {
    field: CustomField;
    currentValue: string;
    onSave: (val: string) => Promise<void>;
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(currentValue);
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Keep draft in sync when parent pushes a realtime update
    useEffect(() => { setDraft(currentValue); }, [currentValue]);
    useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

    const save = async (val: string) => {
        setSaving(true);
        try {
            await onSave(val);
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const displayValue = () => {
        if (!currentValue && currentValue !== "false")
            return <span className="text-gray-400 italic text-xs">—</span>;
        if (field.type === "checkbox")
            return currentValue === "true"
                ? <span className="text-emerald-600 text-xs font-semibold">✓ Yes</span>
                : <span className="text-gray-400 text-xs">✗ No</span>;
        if (field.type === "date") {
            try {
                return <span className="text-gray-700 text-xs">
                    {new Date(currentValue).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>;
            } catch { /* fall through */ }
        }
        return <span className="text-gray-700 text-xs">{currentValue}</span>;
    };

    // ── checkbox: one-click toggle ────────────────────────────────────────────
    if (field.type === "checkbox") {
        const checked = currentValue === "true";
        return (
            <button
                onClick={() => save(checked ? "false" : "true")}
                disabled={saving}
                className="flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title={checked ? "Mark as No" : "Mark as Yes"}
            >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    checked ? "bg-emerald-500 border-emerald-600" : "border-gray-300 bg-gray-100 hover:border-gray-400"
                }`}>
                    {checked && <Check size={10} className="text-white" />}
                </div>
                {saving && <Loader2 size={11} className="animate-spin text-gray-400" />}
            </button>
        );
    }

    // ── dropdown: immediate select ────────────────────────────────────────────
    if (field.type === "dropdown") {
        return (
            <div className="flex items-center gap-1">
                <select
                    value={draft}
                    disabled={saving}
                    onChange={(e) => { setDraft(e.target.value); save(e.target.value); }}
                    className="silver-input border border-gray-300 text-gray-800 text-xs rounded px-2 py-1 focus:outline-none transition w-full max-w-[160px] cursor-pointer disabled:opacity-50"
                >
                    <option value="">— choose —</option>
                    {(field.options || []).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                {saving && <Loader2 size={11} className="animate-spin text-gray-400" />}
            </div>
        );
    }

    // ── text / number / date: click to edit ──────────────────────────────────
    if (editing) {
        return (
            <div className="flex items-center gap-1">
                <input
                    ref={inputRef}
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") save(draft);
                        if (e.key === "Escape") { setEditing(false); setDraft(currentValue); }
                    }}
                    disabled={saving}
                    className="silver-input text-gray-850 text-xs rounded px-2 py-1 focus:outline-none w-full max-w-[150px] disabled:opacity-50"
                />
                <button
                    onClick={() => save(draft)}
                    disabled={saving}
                    className="text-emerald-600 hover:text-emerald-500 disabled:opacity-50 cursor-pointer flex-shrink-0"
                >
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                </button>
                <button
                    onClick={() => { setEditing(false); setDraft(currentValue); }}
                    className="text-gray-450 hover:text-gray-700 cursor-pointer flex-shrink-0"
                >
                    <X size={12} />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 group/val cursor-pointer text-left"
        >
            {displayValue()}
            <Pencil size={10} className="text-gray-400 group-hover/val:text-gray-600 transition ml-0.5 flex-shrink-0" />
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CardCustomFields({
    boardCustomFields,
    cardValues,
    onSetValue,
    onCreateField,
    onDeleteField,
}: CardCustomFieldsProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState<FieldType>("text");
    const [newOptions, setNewOptions] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [deletingFieldId, setDeletingFieldId] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!newName.trim() || isSaving) return;
        setIsSaving(true);
        try {
            const opts = newType === "dropdown"
                ? newOptions.split(",").map((s) => s.trim()).filter(Boolean)
                : [];
            await onCreateField(newName.trim(), newType, opts);
            setNewName("");
            setNewType("text");
            setNewOptions("");
            setIsCreating(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteField = async (fieldId: string) => {
        if (deletingFieldId) return;
        setDeletingFieldId(fieldId);
        try {
            await onDeleteField(fieldId);
        } finally {
            setDeletingFieldId(null);
        }
    };

    // ── Empty state ───────────────────────────────────────────────────────────
    if (boardCustomFields.length === 0 && !isCreating) {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500">
                    <SlidersHorizontal size={18} />
                    <h3 className="font-semibold text-sm text-gray-700">Custom Fields</h3>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="text-xs text-gray-750 hover:text-gray-950 flex items-center gap-1.5 font-semibold transition pl-7 cursor-pointer"
                >
                    <Plus size={13} /> Add a custom field
                </button>
            </div>
        );
    }

    // ── Main render ───────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                    <SlidersHorizontal size={18} />
                    <h3 className="font-semibold text-sm text-gray-700">Custom Fields</h3>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-1 text-[10px] text-gray-750 hover:text-gray-950 font-semibold transition cursor-pointer"
                    >
                        <Plus size={11} /> Add field
                    </button>
                )}
            </div>

            {/* Fields Table */}
            {boardCustomFields.length > 0 && (
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-xs">
                        <tbody>
                            {boardCustomFields.map((field, idx) => {
                                const savedVal = cardValues[field.id] ?? "";
                                const meta = TYPE_META[field.type];
                                const isDeleting = deletingFieldId === field.id;

                                return (
                                    <tr
                                        key={field.id}
                                        className={`group/row border-b border-gray-200 last:border-b-0 transition ${
                                            idx % 2 === 0 ? "bg-gray-100/50" : "bg-transparent"
                                        } ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
                                    >
                                        {/* Field name + type icon */}
                                        <td className="px-3 py-2.5 w-[42%]">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-gray-400 flex-shrink-0">{meta.icon}</span>
                                                <span className="font-medium text-gray-700 truncate">{field.name}</span>
                                            </div>
                                        </td>

                                        {/* Value editor */}
                                        <td className="px-3 py-2.5">
                                            <FieldValueEditor
                                                field={field}
                                                currentValue={savedVal}
                                                onSave={(val) => onSetValue(field.id, val)}
                                            />
                                        </td>

                                        {/* Delete field (admin action) */}
                                        <td className="pr-2 py-2.5 w-8">
                                            <button
                                                onClick={() => handleDeleteField(field.id)}
                                                disabled={!!deletingFieldId}
                                                title={`Delete field "${field.name}"`}
                                                className="opacity-0 group-hover/row:opacity-100 text-gray-400 hover:text-rose-500 transition cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                                            >
                                                {isDeleting
                                                    ? <Loader2 size={12} className="animate-spin" />
                                                    : <Trash2 size={12} />
                                                }
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create New Field Form */}
            {isCreating && (
                <div className="silver-metallic border border-gray-300 rounded-lg p-3 space-y-2.5 shadow-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">New custom field</span>
                        <button
                            onClick={() => { setIsCreating(false); setNewName(""); setNewOptions(""); }}
                            className="text-gray-450 hover:text-gray-700 cursor-pointer"
                        >
                            <X size={13} />
                        </button>
                    </div>

                    {/* Name */}
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Field name (e.g. Story Points)"
                        autoFocus
                        className="w-full silver-input text-gray-850 text-xs rounded-lg p-2 focus:outline-none transition"
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />

                    {/* Type selector */}
                    <div className="flex gap-1.5 flex-wrap">
                        {FIELD_TYPES.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setNewType(t)}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border transition cursor-pointer ${
                                    newType === t
                                        ? "silver-btn text-xs"
                                        : "border-gray-300 text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                                }`}
                            >
                                {TYPE_META[t].icon}
                                {TYPE_META[t].label}
                            </button>
                        ))}
                    </div>

                    {/* Dropdown options (only when type = dropdown) */}
                    {newType === "dropdown" && (
                        <input
                            type="text"
                            value={newOptions}
                            onChange={(e) => setNewOptions(e.target.value)}
                            placeholder="Options: Low, Medium, High (comma-separated)"
                            className="w-full silver-input text-gray-850 text-xs rounded-lg p-2 focus:outline-none transition"
                        />
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={() => { setIsCreating(false); setNewName(""); setNewOptions(""); }}
                            className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={!newName.trim() || isSaving}
                            className="flex items-center gap-1 silver-btn text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
                        >
                            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                            Create
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
