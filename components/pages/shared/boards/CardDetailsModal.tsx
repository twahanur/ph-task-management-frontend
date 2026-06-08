import { useState, useEffect, useRef } from "react";
import { AlignLeft, Plus, CheckSquare, X, Paperclip, Copy } from "lucide-react";
import { toast } from "sonner";
import { addMemberToCard, removeMemberFromCard, updateCard, getCard, duplicateCard } from "@/service/listService/list.service";
import { TBoardDetails } from "@/types/baordType/board.type";
import { useUser } from "@/provider/AuthProvider";
import { getComments, createComment } from "@/service/commentService/comment.service";
import { createChecklist, deleteChecklist, addChecklistItem, toggleChecklistItem, updateChecklist, updateChecklistItem } from "@/service/checklistService/checklist.service";
import { getBoardLabels, createBoardLabel, assignLabelToCard, unassignLabelFromCard } from "@/service/labelService/label.service";
import { getBoardCustomFields, createCustomField, deleteCustomField, getCardCustomFieldValues, setCustomFieldValue } from "@/service/customFieldService/customField.service";
import { useSocket } from "@/provider/SocketProvider";
import CardChecklists from "./components/CardChecklists";
import CardComments from "./components/CardComments";
import CardDescription from "./components/CardDescription";
import CardMembersPopover from "./components/CardMembersPopover";
import CardLabelsPopover from "./components/CardLabelsPopover";
import CardCustomFields from "./components/CardCustomFields";
import CardAttachments from "./components/CardAttachments";
import { uploadAttachment, deleteAttachment } from "@/service/attachmentService/attachment.service";

interface CardDetailsModalProps {
    card: any;
    board: TBoardDetails;
    projectId: string;
    onClose: () => void;
}

export default function CardDetailsModal({ card, board, projectId, onClose }: CardDetailsModalProps) {
    const { user } = useUser();

    // Find the latest card data from the board prop
    const cardFromBoard = board.lists
        ?.flatMap((l: any) => l.cards || [])
        ?.find((c: any) => c.id === card.id) || card;

    const [cardDetails, setCardDetails] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(true);

    const fetchCardDetails = async () => {
        try {
            const res = await getCard(board.id, card.id);
            if (res.success) {
                setCardDetails(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch card details", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    useEffect(() => {
        fetchCardDetails();
    }, [board.id, card.id]);

    const currentCard = cardDetails || cardFromBoard;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File size must not exceed 10MB.");
            return;
        }

        const allowedExtensions = [
            ".jpg", ".jpeg", ".png", ".gif", ".webp",
            ".pdf",
            ".zip",
            ".txt", ".csv",
            ".doc", ".docx",
            ".xls", ".xlsx"
        ];
        const fileName = file.name.toLowerCase();
        const hasValidExt = allowedExtensions.some(ext => fileName.endsWith(ext));

        const allowedMimeTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'application/zip', 'application/x-zip-compressed',
            'text/plain', 'text/csv',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        const hasValidMime = allowedMimeTypes.includes(file.type);

        if (!hasValidExt && !hasValidMime) {
            toast.error("Unsupported file type. Please upload JPG, PNG, GIF, WEBP, PDF, ZIP, TXT, CSV, Word docs, or Excel sheets.");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Uploading attachment...");
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await uploadAttachment(board.id, card.id, formData, projectId);
            if (res.success) {
                toast.success("File attached successfully", { id: toastId });
                fetchCardDetails();
            } else {
                toast.error(res.message || "Failed to upload file", { id: toastId });
            }
        } catch (error) {
            toast.error("Failed to upload file", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteAttachment = async (attachmentId: string) => {
        try {
            const res = await deleteAttachment(board.id, attachmentId, projectId);
            if (res.success) {
                toast.success("Attachment removed successfully");
                fetchCardDetails();
            } else {
                toast.error(res.message || "Failed to delete attachment");
            }
        } catch (error) {
            toast.error("Failed to delete attachment");
        }
    };

    const [isAddingChecklist, setIsAddingChecklist] = useState(false);
    const [checklistTitle, setChecklistTitle] = useState("");
    const [isCreatingChecklist, setIsCreatingChecklist] = useState(false);

    const handleCreateChecklist = async () => {
        if (!checklistTitle.trim() || isCreatingChecklist) return;
        setIsCreatingChecklist(true);
        try {
            const currentPosition = (currentCard.checklists?.length || 0) + 1.0;
            const res = await createChecklist(board.id, card.id, { title: checklistTitle, position: currentPosition }, projectId);
            if (res.success) {
                setChecklistTitle("");
                setIsAddingChecklist(false);
                fetchCardDetails();
            } else {
                toast.error(res.message || "Failed to create checklist");
            }
        } catch (error) {
            toast.error("Failed to create checklist");
        } finally {
            setIsCreatingChecklist(false);
        }
    };

    const handleDeleteChecklist = async (checklistId: string) => {
        try {
            const res = await deleteChecklist(board.id, checklistId, projectId);
            if (res.success) {
                fetchCardDetails();
            } else {
                toast.error(res.message || "Failed to delete checklist");
            }
        } catch (error) {
            toast.error("Failed to delete checklist");
        }
    };

    const handleAddChecklistItem = async (checklistId: string, title: string) => {
        try {
            const res = await addChecklistItem(board.id, checklistId, { title }, projectId);
            if (res.success) {
                fetchCardDetails();
            } else {
                toast.error(res.message || "Failed to add item");
            }
        } catch (error) {
            toast.error("Failed to add item");
        }
    };

    const handleToggleChecklistItem = async (checklistId: string, itemId: string) => {
        try {
            const res = await toggleChecklistItem(board.id, checklistId, itemId, projectId);
            if (res.success) {
                fetchCardDetails();
            } else {
                toast.error(res.message || "Failed to toggle status");
            }
        } catch (error) {
            toast.error("Failed to toggle status");
        }
    };

    const handleUpdateChecklist = async (checklistId: string, title: string) => {
        try {
            const res = await updateChecklist(board.id, checklistId, { title }, projectId);
            if (res.success) {
                fetchCardDetails();
            } else {
                toast.error(res.message || "Failed to update checklist");
            }
        } catch (error) {
            toast.error("Failed to update checklist");
        }
    };

    const handleUpdateChecklistItem = async (
        itemId: string,
        data: {
            title?: string;
            is_completed?: boolean;
            due_date?: string | null;
            assigned_to?: string | null;
            position?: number;
        }
    ) => {
        try {
            const res = await updateChecklistItem(board.id, itemId, data, projectId);
            if (res.success) {
                fetchCardDetails();
            } else {
                toast.error(res.message || "Failed to update checklist item");
            }
        } catch (error) {
            toast.error("Failed to update checklist item");
        }
    };
    
    // Comments States
    const [comments, setComments] = useState<any[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);

    // Card Update States
    const [status, setStatus] = useState(card.status || "todo");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleUpdateStatus = async (newStatus: string) => {
        if (isUpdatingStatus) return;
        setIsUpdatingStatus(true);
        try {
            const res = await updateCard(board.id, card.id, { status: newStatus }, projectId);
            if (res.success) {
                setStatus(newStatus);
            } else {
                toast.error(res.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleSaveDescription = async (newDescription: string) => {
        try {
            const res = await updateCard(board.id, card.id, { description: newDescription }, projectId);
            if (!res.success) {
                toast.error(res.message || "Failed to update description");
            }
        } catch (error) {
            toast.error("Failed to update description");
        }
    };

    const fetchComments = async () => {
        if (!board?.id || !card?.id) return;
        try {
            const res = await getComments(board.id, card.id);
            console.log("[CardDetailsModal] Raw comment API response:", JSON.stringify(res, null, 2));
            let commentList: any[] = [];
            if (res?.success && Array.isArray(res.data)) {
                commentList = res.data;
            } else if (Array.isArray(res)) {
                commentList = res;
            } else if (res?.data && Array.isArray(res.data)) {
                commentList = res.data;
            } else {
                commentList = res?.data || [];
            }
            console.log("[CardDetailsModal] Parsed comments:", commentList);
            setComments(commentList);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [board?.id, card?.id]);

    useEffect(() => {
        setStatus(currentCard.status || "todo");
    }, [currentCard.status]);

    const handleAddComment = async (content: string) => {
        try {
            const res = await createComment(board.id, card.id, { content }, projectId);
            if (res.success) {
                fetchComments();
            } else {
                toast.error(res.message || "Failed to add comment");
            }
        } catch (error) {
            toast.error("Failed to add comment");
        }
    };

    const handleAddReply = async (content: string, parentId: string) => {
        try {
            const res = await createComment(
                board.id,
                card.id,
                { content, parentId },
                projectId
            );
            if (res.success) {
                fetchComments();
            } else {
                toast.error(res.message || "Failed to add reply");
            }
        } catch (error) {
            toast.error("Failed to add reply");
        }
    };

    const handleAssignMember = async (userId: string) => {
        if (!card) return;
        const isAssigned = currentCard.members?.some(
            (m: any) => m.id === userId || m.user_id === userId
        );

        if (isAssigned) {
            try {
                const res = await removeMemberFromCard(board?.id, card.id, userId, projectId);
                if (res.success) {
                    fetchCardDetails();
                } else {
                    toast.error(res.message || 'Failed to unassign member');
                }
            } catch (error) {
                toast.error('Failed to unassign member');
            }
        } else {
            try {
                const res = await addMemberToCard(board?.id, card.id, userId, projectId);
                if (res.success) {
                    fetchCardDetails();
                } else {
                    toast.error(res.message || 'Failed to assign member');
                }
            } catch (error) {
                toast.error('Failed to assign member');
            }
        }
    };

    const [isDuplicating, setIsDuplicating] = useState(false);

    const handleDuplicateCard = async () => {
        if (isDuplicating) return;
        setIsDuplicating(true);
        try {
            const res = await duplicateCard(board.id, card.id, projectId);
            if (res.success) {
                onClose();
            } else {
                toast.error(res.message || "Failed to duplicate card");
            }
        } catch (error) {
            toast.error("Failed to duplicate card");
        } finally {
            setIsDuplicating(false);
        }
    };

    // ── Labels ───────────────────────────────────────────────────────────────
    const [boardLabels, setBoardLabels] = useState<any[]>([]);

    const fetchBoardLabels = async () => {
        try {
            const res = await getBoardLabels(board.id);
            if (res?.success && Array.isArray(res.data)) {
                setBoardLabels(res.data);
            } else if (Array.isArray(res)) {
                setBoardLabels(res);
            } else if (res?.data && Array.isArray(res.data)) {
                setBoardLabels(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch board labels", error);
        }
    };

    useEffect(() => {
        fetchBoardLabels();
    }, [board.id]);

    const handleCreateLabel = async (name: string, color: string) => {
        try {
            const res = await createBoardLabel(board.id, { name, color }, projectId);
            if (res.success) {
                await fetchBoardLabels();
                toast.success(`Label "${name}" created`);
            } else {
                toast.error(res.message || "Failed to create label");
            }
        } catch (error) {
            toast.error("Failed to create label");
        }
    };

    const handleAssignLabel = async (labelId: string) => {
        try {
            const res = await assignLabelToCard(board.id, card.id, labelId, projectId);
            if (res.success) {
                fetchCardDetails();
            } else {
                toast.error(res.message || "Failed to assign label");
            }
        } catch (error) {
            toast.error("Failed to assign label");
        }
    };

    const handleUnassignLabel = async (labelId: string) => {
        try {
            const res = await unassignLabelFromCard(board.id, card.id, labelId, projectId);
            if (res.success) {
                fetchCardDetails();
            } else {
                toast.error(res.message || "Failed to remove label");
            }
        } catch (error) {
            toast.error("Failed to remove label");
        }
    };

    // ── Custom Fields ─────────────────────────────────────────────────────────
    const { socket } = useSocket();
    const [boardCustomFields, setBoardCustomFields] = useState<any[]>([]);
    // Map of fieldId -> value string (recommended state model from spec)
    const [cardValues, setCardValues] = useState<Record<string, string>>({});

    const fetchBoardCustomFields = async () => {
        try {
            const res = await getBoardCustomFields(board.id);
            if (res?.success && Array.isArray(res.data)) {
                setBoardCustomFields(res.data);
            } else if (Array.isArray(res)) {
                setBoardCustomFields(res);
            } else if (res?.data && Array.isArray(res.data)) {
                setBoardCustomFields(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch custom fields", error);
        }
    };

    const fetchCardFieldValues = async () => {
        try {
            const res = await getCardCustomFieldValues(board.id, card.id);
            const list: any[] = res?.success && Array.isArray(res.data)
                ? res.data
                : Array.isArray(res)
                ? res
                : res?.data && Array.isArray(res.data)
                ? res.data
                : [];
            // Convert array to map: fieldId -> value
            const map: Record<string, string> = {};
            for (const v of list) {
                const fid = v.field_id || v.fieldId;
                if (fid) map[fid] = v.value ?? "";
            }
            setCardValues(map);
        } catch (error) {
            console.error("Failed to fetch card custom field values", error);
        }
    };

    useEffect(() => {
        fetchBoardCustomFields();
        fetchCardFieldValues();
    }, [board.id, card.id]);

    // ── Custom field socket events ────────────────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        const onFieldCreated = (payload: { boardId: string; field: any }) => {
            if (payload.boardId !== board.id) return;
            setBoardCustomFields((prev) => {
                // avoid duplicate
                if (prev.some((f) => f.id === payload.field.id)) return prev;
                return [...prev, payload.field];
            });
        };

        const onFieldDeleted = (payload: { boardId: string; fieldId: string }) => {
            if (payload.boardId !== board.id) return;
            setBoardCustomFields((prev) => prev.filter((f) => f.id !== payload.fieldId));
            setCardValues((prev) => {
                const next = { ...prev };
                delete next[payload.fieldId];
                return next;
            });
        };

        const onFieldValueUpdated = (payload: {
            boardId: string;
            cardId: string;
            fieldId: string;
            value: string;
        }) => {
            if (payload.boardId !== board.id || payload.cardId !== card.id) return;
            setCardValues((prev) => ({ ...prev, [payload.fieldId]: payload.value }));
        };

        socket.on("board:custom-field-created", onFieldCreated);
        socket.on("board:custom-field-deleted", onFieldDeleted);
        socket.on("board:card-custom-field-updated", onFieldValueUpdated);

        return () => {
            socket.off("board:custom-field-created", onFieldCreated);
            socket.off("board:custom-field-deleted", onFieldDeleted);
            socket.off("board:card-custom-field-updated", onFieldValueUpdated);
        };
    }, [socket, board.id, card.id]);

    const handleCreateCustomField = async (
        name: string,
        type: "text" | "number" | "date" | "checkbox" | "dropdown",
        options: string[]
    ) => {
        try {
            const res = await createCustomField(board.id, { name, type, options }, projectId);
            if (res.success) {
                // Socket will push board:custom-field-created to update state
                // but also refetch in case socket isn't connected
                await fetchBoardCustomFields();
                toast.success(`Custom field "${name}" created`);
            } else {
                toast.error(res.message || "Failed to create custom field");
            }
        } catch (error) {
            toast.error("Failed to create custom field");
        }
    };

    const handleDeleteCustomField = async (fieldId: string) => {
        try {
            const res = await deleteCustomField(board.id, fieldId, projectId);
            if (res.success) {
                // Socket will push board:custom-field-deleted; fallback below
                setBoardCustomFields((prev) => prev.filter((f) => f.id !== fieldId));
                setCardValues((prev) => { const next = { ...prev }; delete next[fieldId]; return next; });
            } else {
                toast.error(res.message || "Failed to delete custom field");
            }
        } catch (error) {
            toast.error("Failed to delete custom field");
        }
    };

    const handleSetCustomFieldValue = async (fieldId: string, value: string) => {
        // Optimistic update
        setCardValues((prev) => ({ ...prev, [fieldId]: value }));
        try {
            const res = await setCustomFieldValue(board.id, card.id, fieldId, value, projectId);
            if (!res.success) {
                toast.error(res.message || "Failed to set field value");
                // Revert on failure
                await fetchCardFieldValues();
            }
            // Socket board:card-custom-field-updated will keep others in sync
        } catch (error) {
            toast.error("Failed to set field value");
            await fetchCardFieldValues();
        }
    };

    return (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
            <div 
                className="silver-metallic w-full max-w-4xl max-h-full overflow-y-auto rounded-[24px]! shadow-2xl flex flex-col relative border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-1.5 hover:bg-gray-200/50 rounded-lg transition z-10"
                >
                    <X size={20} />
                </button>

                {/* Top Section - Template Banner Example */}
                {currentCard.is_template && (
                    <div className="silver-input p-4 flex items-center justify-between border-b border-gray-300 rounded-t-xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-300 p-1.5 rounded"><AlignLeft size={16} className="text-gray-700" /></div>
                            <span className="text-gray-800 font-medium">This is a Template card.</span>
                        </div>
                        <button className="silver-btn px-3 py-1.5 rounded text-sm font-medium transition flex items-center gap-2">
                            <Plus size={14} /> Create card from template
                        </button>
                    </div>
                )}

                <div className="flex flex-col md:flex-row p-6 gap-6">
                    {/* Left Column */}
                    <div className="flex-1 space-y-8">
                        {/* Title Area */}
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-gray-600"><AlignLeft size={24} /></div>
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{currentCard.title}</h2>
                                    <p className="text-sm text-gray-500">in list <span className="underline cursor-pointer">{board.lists?.find(l => l.id === currentCard.list_id)?.name || "Unknown List"}</span></p>
                                    {/* Assigned Labels Pills */}
                                    {currentCard.labels && currentCard.labels.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {currentCard.labels.map((lbl: any) => (
                                                <span
                                                    key={lbl.id || lbl.label_id}
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white leading-none"
                                                    style={{ backgroundColor: lbl.color || lbl.label?.color || "#64748b" }}
                                                >
                                                    {lbl.name || lbl.label?.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                 {/* Status Dropdown */}
                                 <div className="flex items-center gap-2">
                                     <span className="text-xs text-gray-500 font-medium">
                                         {isUpdatingStatus ? "Updating..." : "Status:"}
                                     </span>
                                     <select
                                         value={status}
                                         disabled={isUpdatingStatus}
                                         onChange={(e) => handleUpdateStatus(e.target.value)}
                                         className="silver-input border-gray-300 text-gray-800 rounded-lg text-xs px-3 py-1.5 focus:outline-none transition cursor-pointer font-semibold disabled:opacity-50"
                                     >
                                         <option value="todo">To Do</option>
                                         <option value="in_progress">In Progress</option>
                                         <option value="completed">Completed</option>
                                     </select>
                                 </div>
                            </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex flex-wrap gap-2 pl-10">
                            <button className="flex items-center gap-2 silver-btn px-3 py-1.5 rounded text-sm transition">
                                <Plus size={16} /> Add
                            </button>
                            {/* Labels Popover */}
                            <CardLabelsPopover
                                boardLabels={boardLabels}
                                cardLabels={currentCard.labels || []}
                                onAssignLabel={handleAssignLabel}
                                onUnassignLabel={handleUnassignLabel}
                                onCreateLabel={handleCreateLabel}
                            />
                            {/* Checklist Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsAddingChecklist(!isAddingChecklist)}
                                    className="flex items-center gap-2 silver-btn px-3 py-1.5 rounded text-sm transition cursor-pointer"
                                >
                                    <CheckSquare size={16} /> Checklist
                                </button>
                                
                                {isAddingChecklist && (
                                    <div className="absolute top-full left-0 mt-2 w-64 silver-metallic border border-gray-300 rounded-xl shadow-xl z-20 p-3">
                                        <div className="flex justify-between items-center mb-2.5">
                                            <h4 className="text-sm font-semibold text-gray-700">Add Checklist</h4>
                                            <button onClick={() => setIsAddingChecklist(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={14} /></button>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <input 
                                                type="text"
                                                value={checklistTitle}
                                                onChange={(e) => setChecklistTitle(e.target.value)}
                                                placeholder="Checklist Title"
                                                className="w-full silver-input text-gray-800 text-xs rounded-lg p-2.5 focus:outline-none transition"
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleCreateChecklist}
                                                disabled={!checklistTitle.trim() || isCreatingChecklist}
                                                className="w-full silver-btn text-xs font-bold py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
                                            >
                                                {isCreatingChecklist ? "Adding..." : "Add"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Members Dropdown */}
                            <CardMembersPopover 
                                boardMembers={board.members || []}
                                cardMembers={currentCard.members || []}
                                onAssignMember={handleAssignMember}
                            />
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="flex items-center gap-2 silver-btn px-3 py-1.5 rounded text-sm transition cursor-pointer disabled:opacity-50"
                            >
                                <Paperclip size={16} className={isUploading ? "animate-spin" : ""} />
                                {isUploading ? "Uploading..." : "Attachment"}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.zip,.txt,.csv,.doc,.docx,.xls,.xlsx"
                            />

                            <button 
                                onClick={handleDuplicateCard}
                                disabled={isDuplicating}
                                className="flex items-center gap-2 silver-btn px-3 py-1.5 rounded text-sm transition cursor-pointer disabled:opacity-50"
                            >
                                <Copy size={16} className={isDuplicating ? "animate-spin" : ""} />
                                {isDuplicating ? "Duplicating..." : "Duplicate"}
                            </button>
                        </div>

                        {/* Description Area */}
                        <CardDescription 
                            initialDescription={currentCard.description || ""}
                            onSaveDescription={handleSaveDescription}
                        />

                        {/* Attachments Section */}
                        <CardAttachments 
                            attachments={currentCard.attachments || []}
                            onDelete={handleDeleteAttachment}
                        />

                        {/* Checklists Section */}
                        <CardChecklists 
                            checklists={currentCard.checklists || []}
                            boardMembers={board.members || []}
                            onDeleteChecklist={handleDeleteChecklist}
                            onAddItem={handleAddChecklistItem}
                            onToggleItem={handleToggleChecklistItem}
                            onUpdateChecklist={handleUpdateChecklist}
                            onUpdateChecklistItem={handleUpdateChecklistItem}
                        />

                        {/* Custom Fields Section */}
                        <CardCustomFields
                            boardCustomFields={boardCustomFields}
                            cardValues={cardValues}
                            onSetValue={handleSetCustomFieldValue}
                            onCreateField={handleCreateCustomField}
                            onDeleteField={handleDeleteCustomField}
                        />
                    </div>


                    {/* Right Column - Comments and Activity */}
                    <div className="w-full md:w-80 flex flex-col border-t md:border-t-0 md:border-l border-gray-300 pt-6 md:pt-0 md:pl-6 min-h-0">
                        {/* Assigned Card Members Row */}
                        {currentCard.members && currentCard.members.length > 0 && (
                            <div className="mb-5 silver-input p-2.5 rounded-lg border border-gray-200">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-2">Assigned Members</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {currentCard.members.map((member: any, idx: number) => {
                                        const userObj = member.user || member;
                                        const name = userObj.name || "User";
                                        const email = userObj.email || "";
                                        const avatar = userObj.avatar_url || userObj.avatar_secure_url;
                                        const initials = name.charAt(0).toUpperCase();

                                        return (
                                            <div 
                                                key={idx} 
                                                className="group relative cursor-pointer"
                                            >
                                                <div className="w-7 h-7 rounded-full bg-gray-300 border border-gray-400 flex items-center justify-center text-xs font-bold text-gray-800 overflow-hidden shadow transition-transform hover:scale-105">
                                                    {avatar ? (
                                                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        initials
                                                    )}
                                                </div>
                                                
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block silver-metallic text-xs text-gray-800 border border-gray-300 rounded px-2.5 py-1.5 whitespace-nowrap shadow-xl z-50 pointer-events-none transition-all duration-200">
                                                    <div className="font-semibold">{name}</div>
                                                    {email && <div className="text-[10px] text-gray-500 mt-0.5">{email}</div>}
                                                    {/* Triangle pointer */}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[#F1F3F5] border-r border-b border-gray-300 rotate-45"></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <CardComments 
                            comments={comments}
                            loadingComments={loadingComments}
                            currentUser={user}
                            onAddComment={handleAddComment}
                            onAddReply={handleAddReply}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
