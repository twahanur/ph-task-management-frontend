import { useState } from "react";
import { CheckSquare, UserPlus, Clock, X } from "lucide-react";

interface ChecklistItem {
    id: string;
    title: string;
    is_completed?: boolean;
    isCompleted?: boolean;
    status?: string;
    due_date?: string | null;
    assigned_to?: string | null;
    assignee?: {
        id: string;
        name: string;
        avatar_url?: string | null;
    } | null;
}

interface Checklist {
    id: string;
    title: string;
    items?: ChecklistItem[];
    progress?: {
        percent: number;
        completed: number;
        total: number;
    };
}

interface CardChecklistsProps {
    checklists: Checklist[];
    boardMembers: any[];
    onDeleteChecklist: (checklistId: string) => Promise<void>;
    onAddItem: (checklistId: string, title: string) => Promise<void>;
    onToggleItem: (checklistId: string, itemId: string) => Promise<void>;
    onUpdateChecklist?: (checklistId: string, title: string) => Promise<void>;
    onUpdateChecklistItem?: (itemId: string, data: { title?: string; is_completed?: boolean; due_date?: string | null; assigned_to?: string | null }) => Promise<void>;
}

export default function CardChecklists({
    checklists,
    boardMembers,
    onDeleteChecklist,
    onAddItem,
    onToggleItem,
    onUpdateChecklist,
    onUpdateChecklistItem
}: CardChecklistsProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingItemId, setTogglingItemId] = useState<string | null>(null);

    const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);
    const [editingChecklistTitle, setEditingChecklistTitle] = useState("");

    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingItemTitle, setEditingItemTitle] = useState("");

    const [activeAssignItemId, setActiveAssignItemId] = useState<string | null>(null);
    const [activeDateItemId, setActiveDateItemId] = useState<string | null>(null);

    if (!checklists || checklists.length === 0) return null;

    const handleDelete = async (id: string) => {
        if (deletingId) return;
        setDeletingId(id);
        try {
            await onDeleteChecklist(id);
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggle = async (checklistId: string, itemId: string) => {
        if (togglingItemId) return;
        setTogglingItemId(itemId);
        try {
            if (onUpdateChecklistItem) {
                const targetChecklist = checklists.find(c => c.id === checklistId);
                const targetItem = targetChecklist?.items?.find(i => i.id === itemId);
                const isCompleted = !!(targetItem?.is_completed || targetItem?.isCompleted || targetItem?.status === "completed");
                await onUpdateChecklistItem(itemId, { is_completed: !isCompleted });
            } else {
                await onToggleItem(checklistId, itemId);
            }
        } finally {
            setTogglingItemId(null);
        }
    };

    const handleSaveChecklistTitle = async (checklistId: string) => {
        const titleStr = editingChecklistTitle.trim();
        if (!titleStr || titleStr === checklists.find(c => c.id === checklistId)?.title) {
            setEditingChecklistId(null);
            return;
        }
        setEditingChecklistId(null);
        if (onUpdateChecklist) {
            await onUpdateChecklist(checklistId, titleStr);
        }
    };

    const handleSaveItemTitle = async (itemId: string, originalTitle: string) => {
        const titleStr = editingItemTitle.trim();
        if (!titleStr || titleStr === originalTitle) {
            setEditingItemId(null);
            return;
        }
        setEditingItemId(null);
        if (onUpdateChecklistItem) {
            await onUpdateChecklistItem(itemId, { title: titleStr });
        }
    };

    const handleUpdateItemAssignee = async (itemId: string, userId: string | null) => {
        setActiveAssignItemId(null);
        if (onUpdateChecklistItem) {
            await onUpdateChecklistItem(itemId, { assigned_to: userId });
        }
    };

    const handleUpdateItemDueDate = async (itemId: string, dateStr: string | null) => {
        setActiveDateItemId(null);
        if (onUpdateChecklistItem) {
            const finalDate = dateStr ? new Date(dateStr).toISOString() : null;
            await onUpdateChecklistItem(itemId, { due_date: finalDate });
        }
    };

    return (
        <div className="space-y-6 mt-6">
            {checklists.map((checklist) => {
                const totalItems = checklist.items?.length || 0;
                const completedItems = checklist.items?.filter((item) => item.is_completed || item.isCompleted || item.status === "completed").length || 0;
                const progressPercent = checklist.progress ? checklist.progress.percent : (totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0);
                const isDeleting = deletingId === checklist.id;

                return (
                    <div 
                        key={checklist.id} 
                        className={`flex items-start gap-4 silver-input p-4 rounded-xl border border-gray-200 transition-opacity duration-250 ${
                            isDeleting ? "opacity-50" : ""
                        }`}
                    >
                        <div className="mt-1 text-gray-500"><CheckSquare size={20} /></div>
                        <div className="flex-1">
                            {/* Checklist Header */}
                            <div className="flex items-center justify-between mb-2">
                                {editingChecklistId === checklist.id ? (
                                    <input
                                        type="text"
                                        value={editingChecklistTitle}
                                        onChange={(e) => setEditingChecklistTitle(e.target.value)}
                                        onBlur={() => handleSaveChecklistTitle(checklist.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleSaveChecklistTitle(checklist.id);
                                            } else if (e.key === "Escape") {
                                                setEditingChecklistId(null);
                                            }
                                        }}
                                        className="silver-input text-sm font-semibold text-gray-800 px-2 py-1 rounded focus:outline-none max-w-[250px]"
                                        autoFocus
                                    />
                                ) : (
                                    <h4 
                                        onClick={() => {
                                            setEditingChecklistId(checklist.id);
                                            setEditingChecklistTitle(checklist.title);
                                        }}
                                        className="text-md font-semibold text-gray-800 hover:bg-gray-200/50 px-2 py-0.5 rounded cursor-pointer transition select-none"
                                        title="Click to rename checklist"
                                    >
                                        {checklist.title}
                                    </h4>
                                )}
                                <button 
                                    onClick={() => handleDelete(checklist.id)}
                                    disabled={isDeleting}
                                    className="text-red-500 hover:text-red-650 text-xs font-semibold px-2 py-1 rounded transition hover:bg-red-50 cursor-pointer disabled:opacity-50"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-bold text-gray-550 w-8">{progressPercent}%</span>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Items List */}
                            {checklist.items && checklist.items.length > 0 && (
                                <div className="space-y-2 mb-3">
                                    {checklist.items.map((item) => {
                                        const isCompleted = item.is_completed || item.isCompleted || item.status === "completed";
                                        const isToggling = togglingItemId === item.id;
                                        return (
                                            <div key={item.id} className="group relative flex flex-col gap-1 py-1.5 px-2.5 rounded-lg hover:bg-gray-100 transition-all">
                                                <div className="flex items-center gap-2.5">
                                                    <input 
                                                        type="checkbox"
                                                        checked={isCompleted}
                                                        disabled={isToggling}
                                                        onChange={() => handleToggle(checklist.id, item.id)}
                                                        className="w-4 h-4 rounded border-gray-300 text-gray-700 bg-gray-100 focus:ring-gray-400 cursor-pointer disabled:opacity-50 flex-shrink-0"
                                                    />
                                                    {editingItemId === item.id ? (
                                                        <input
                                                            type="text"
                                                            value={editingItemTitle}
                                                            onChange={(e) => setEditingItemTitle(e.target.value)}
                                                            onBlur={() => handleSaveItemTitle(item.id, item.title)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    handleSaveItemTitle(item.id, item.title);
                                                                } else if (e.key === "Escape") {
                                                                    setEditingItemId(null);
                                                                }
                                                            }}
                                                            className="silver-input text-xs text-gray-850 px-2 py-0.5 rounded focus:outline-none flex-1 max-w-[250px]"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span 
                                                            onClick={() => {
                                                                setEditingItemId(item.id);
                                                                setEditingItemTitle(item.title);
                                                            }}
                                                            className={`text-xs transition-all hover:bg-gray-200/50 px-2 py-0.5 rounded cursor-pointer select-none ${
                                                                isCompleted ? "line-through text-gray-400" : "text-gray-700"
                                                            } ${isToggling ? "opacity-50" : ""}`}
                                                            title="Click to edit item title"
                                                        >
                                                            {item.title} {isToggling && <span className="text-[10px] text-gray-400 ml-1.5">(updating...)</span>}
                                                        </span>
                                                    )}

                                                    {/* Quick Action Icons - Visible on hover */}
                                                    <div className="hidden group-hover:flex items-center gap-1.5 ml-auto flex-shrink-0">
                                                        <button
                                                            onClick={() => {
                                                                setActiveDateItemId(null);
                                                                setActiveAssignItemId(activeAssignItemId === item.id ? null : item.id);
                                                            }}
                                                            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-800 transition cursor-pointer"
                                                            title="Assign member"
                                                        >
                                                            <UserPlus size={13} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setActiveAssignItemId(null);
                                                                setActiveDateItemId(activeDateItemId === item.id ? null : item.id);
                                                            }}
                                                            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-800 transition cursor-pointer"
                                                            title="Set due date"
                                                        >
                                                            <Clock size={13} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Meta Row: Assignee & Due Date Badge */}
                                                {(item.assignee || item.due_date) && (
                                                    <div className="flex items-center gap-2 pl-6.5 mt-0.5">
                                                        {item.assignee && (
                                                            <div 
                                                                onClick={() => {
                                                                    setActiveDateItemId(null);
                                                                    setActiveAssignItemId(activeAssignItemId === item.id ? null : item.id);
                                                                }}
                                                                className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-300 transition cursor-pointer"
                                                                title={`Assigned to ${item.assignee.name}. Click to change.`}
                                                            >
                                                                <div className="w-3.5 h-3.5 rounded-full bg-gray-300 flex items-center justify-center text-[8px] text-gray-800 overflow-hidden">
                                                                    {item.assignee.avatar_url ? (
                                                                        <img src={item.assignee.avatar_url} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        item.assignee.name.charAt(0).toUpperCase()
                                                                    )}
                                                                </div>
                                                                <span>{item.assignee.name}</span>
                                                            </div>
                                                        )}

                                                        {item.due_date && (
                                                            <div 
                                                                onClick={() => {
                                                                    setActiveAssignItemId(null);
                                                                    setActiveDateItemId(activeDateItemId === item.id ? null : item.id);
                                                                }}
                                                                className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-gray-300 transition cursor-pointer"
                                                                title="Due date. Click to change."
                                                            >
                                                                <Clock size={10} className="text-gray-500" />
                                                                <span>{new Date(item.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Inline Assign Popover */}
                                                {activeAssignItemId === item.id && (
                                                    <div className="absolute top-full left-6 mt-1 w-56 silver-metallic border border-gray-300 rounded-xl shadow-xl z-20 py-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                                        <div className="px-2 pb-1 border-b border-gray-200 flex justify-between items-center mb-1">
                                                            <span className="text-[11px] font-semibold text-gray-500">Assign Item</span>
                                                            <button onClick={() => setActiveAssignItemId(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={12} /></button>
                                                        </div>
                                                        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
                                                            <button 
                                                                onClick={() => handleUpdateItemAssignee(item.id, null)}
                                                                className="w-full text-left text-xs text-red-500 hover:bg-red-50 p-1.5 rounded transition cursor-pointer"
                                                            >
                                                                Unassigned
                                                            </button>
                                                            {boardMembers?.map((member) => (
                                                                <button
                                                                    key={member.user_id}
                                                                    onClick={() => handleUpdateItemAssignee(item.id, member.user_id)}
                                                                    className="w-full flex items-center gap-2 text-left text-xs text-gray-700 hover:bg-gray-200/50 p-1.5 rounded transition cursor-pointer"
                                                                >
                                                                    <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-[9px] font-bold overflow-hidden text-gray-700">
                                                                        {member.user.avatar_url ? (
                                                                            <img src={member.user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            member.user.name.charAt(0).toUpperCase()
                                                                        )}
                                                                    </div>
                                                                    <span className="truncate">{member.user.name}</span>
                                                                    {item.assigned_to === member.user_id && (
                                                                        <CheckSquare size={12} className="ml-auto text-gray-600" />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Inline Date Popover */}
                                                {activeDateItemId === item.id && (
                                                    <div className="absolute top-full left-6 mt-1 w-60 silver-metallic border border-gray-300 rounded-xl shadow-xl z-20 p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                                        <div className="pb-1 border-b border-gray-200 flex justify-between items-center mb-2">
                                                            <span className="text-[11px] font-semibold text-gray-500">Due Date</span>
                                                            <button onClick={() => setActiveDateItemId(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={12} /></button>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <input 
                                                                type="datetime-local" 
                                                                defaultValue={item.due_date ? new Date(item.due_date).toISOString().substring(0, 16) : ""}
                                                                onChange={(e) => handleUpdateItemDueDate(item.id, e.target.value)}
                                                                className="w-full silver-input text-xs text-gray-850 p-1.5 focus:outline-none"
                                                            />
                                                            {item.due_date && (
                                                                <button
                                                                    onClick={() => handleUpdateItemDueDate(item.id, null)}
                                                                    className="bg-red-100 hover:bg-red-200 text-red-650 text-[10px] font-semibold py-1 rounded border border-red-200 transition cursor-pointer"
                                                                >
                                                                    Remove Due Date
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Add Item form */}
                            <ChecklistItemInput 
                                checklistId={checklist.id}
                                onAddItem={(title) => onAddItem(checklist.id, title)}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ChecklistItemInput({ checklistId, onAddItem }: { checklistId: string; onAddItem: (title: string) => Promise<void> }) {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onAddItem(title);
            setTitle("");
            setIsAdding(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAdding) {
        return (
            <button 
                onClick={() => setIsAdding(true)}
                className="text-xs silver-btn font-medium mt-1 animate-in fade-in duration-200"
            >
                Add an item
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 silver-metallic p-3 rounded-lg border border-gray-250 animate-in slide-in-from-top-2 duration-200">
            <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                placeholder="Add an item"
                className="w-full silver-input text-gray-850 text-sm rounded-lg p-2.5 min-h-[50px] resize-none focus:outline-none disabled:opacity-50"
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
            />
            <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-3">
                    <button 
                        type="submit"
                        disabled={!title.trim() || isSubmitting}
                        className="silver-btn text-xs font-bold px-4 py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting ? "Adding..." : "Add"}
                    </button>
                    <button 
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                            setTitle("");
                            setIsAdding(false);
                        }}
                        className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-2 py-1 transition cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
}
