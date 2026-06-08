/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { TBoardDetails } from "@/types/baordType/board.type";
import { Plus, X } from "lucide-react";
import { createList, createCard, updateCard, reorderLists, moveCard } from "@/service/listService/list.service";
import CardDetailsModal from "./CardDetailsModal";
import { toast } from "sonner";
import BoardHeader from "./components/BoardHeader";
import BoardList from "./components/BoardList";
import { useSocket } from "@/provider/SocketProvider";

export default function BoardDetails({ board, projectId }: { board: TBoardDetails, projectId: string }) {
    const [lists, setLists] = useState<any[]>([]);
    const [draggedListId, setDraggedListId] = useState<string | null>(null);
    const [draggedOverListId, setDraggedOverListId] = useState<string | null>(null);
    const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
    const { socket } = useSocket();

    useEffect(() => {
        if (board.lists) {
            const sorted = [...board.lists].sort((a, b) => a.position - b.position);
            setLists(sorted);
        }
    }, [board.lists]);

    // ── Board socket events ───────────────────────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        const onListsReordered = (payload: {
            boardId: string;
            reorderedByUserId: string;
            lists: Array<{ id: string; position: number }>;
        }) => {
            if (payload.boardId !== board.id) return;
            setLists((prev) => {
                const updated = prev.map((list) => {
                    const match = payload.lists.find((l) => l.id === list.id);
                    return match ? { ...list, position: match.position } : list;
                });
                return [...updated].sort((a, b) => a.position - b.position);
            });
        };

        const onCardsReordered = (payload: {
            boardId: string;
            reorderedByUserId: string;
            cards: Array<{ id: string; list_id: string; position: number }>;
        }) => {
            if (payload.boardId !== board.id) return;
            setLists((prev) =>
                prev.map((list) => {
                    const updatedCards = list.cards?.map((card: any) => {
                        const match = payload.cards.find((c) => c.id === card.id);
                        return match ? { ...card, position: match.position, list_id: match.list_id } : card;
                    });
                    return {
                        ...list,
                        cards: updatedCards
                            ? [...updatedCards].sort((a: any, b: any) => a.position - b.position)
                            : list.cards,
                    };
                })
            );
        };

        const onCardMoved = (payload: {
            boardId: string;
            movedByUserId: string;
            cardId: string;
            fromListId: string;
            toListId: string;
            position: number;
            card: any;
        }) => {
            if (payload.boardId !== board.id) return;
            setLists((prev) => {
                return prev.map((list) => {
                    if (list.id === payload.fromListId) {
                        // Remove from source
                        return {
                            ...list,
                            cards: (list.cards || []).filter((c: any) => c.id !== payload.cardId),
                        };
                    }
                    if (list.id === payload.toListId) {
                        // Add to target (avoid duplicate)
                        const existing = (list.cards || []).filter((c: any) => c.id !== payload.cardId);
                        const movedCard = payload.card
                            ? { ...payload.card, position: payload.position, list_id: payload.toListId }
                            : { id: payload.cardId, position: payload.position, list_id: payload.toListId };
                        const merged = [...existing, movedCard].sort((a: any, b: any) => a.position - b.position);
                        return { ...list, cards: merged };
                    }
                    return list;
                });
            });
        };

        socket.on("board:lists-reordered", onListsReordered);
        socket.on("board:cards-reordered", onCardsReordered);
        socket.on("board:card-moved", onCardMoved);

        return () => {
            socket.off("board:lists-reordered", onListsReordered);
            socket.off("board:cards-reordered", onCardsReordered);
            socket.off("board:card-moved", onCardMoved);
        };
    }, [socket, board.id]);

    const [isAddingList, setIsAddingList] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [isSubmittingList, setIsSubmittingList] = useState(false);
    
    // Card states
    const [addingCardToListId, setAddingCardToListId] = useState<string | null>(null);
    const [newCardTitle, setNewCardTitle] = useState("");
    const [isSubmittingCard, setIsSubmittingCard] = useState(false);

    // Modal states
    const [selectedCard, setSelectedCard] = useState<any>(null);

    const handleCreateList = async () => {
        if (!newListName.trim()) return;
        setIsSubmittingList(true);
        try {
            const res = await createList(board?.id, { name: newListName }, projectId);
            if (res.success) {
                setIsAddingList(false);
                setNewListName("");
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Failed to create list');
        } finally {
            setIsSubmittingList(false);
        }
    };

    const handleCreateCard = async (listId: string) => {
        if (!newCardTitle.trim()) return;
        setIsSubmittingCard(true);
        try {
            const res = await createCard(board?.id, listId, { title: newCardTitle }, projectId);
            if (res.success) {
                setAddingCardToListId(null);
                setNewCardTitle("");
            } else {
                toast.error(res.message || 'Failed to create card');
            }
        } catch (error) {
            toast.error('Failed to create card');
        } finally {
            setIsSubmittingCard(false);
        }
    };

    const handleCompleteCard = async (cardId: string, currentStatus: string) => {
        const nextStatus = currentStatus === "completed" ? "todo" : "completed";
        try {
            const res = await updateCard(board.id, cardId, { status: nextStatus }, projectId);
            if (!res.success) {
                toast.error(res.message || "Failed to update card");
            }
        } catch (error) {
            toast.error("Failed to update card");
        }
    };

    // ==========================================
    // LIST DRAG & DROP
    // ==========================================

    const handleReorderLists = async (listId: string, position: number) => {
        try {
            const res = await reorderLists(board.id, {
                lists: [{ id: listId, position }]
            }, projectId);
            if (!res.success) {
                toast.error(res.message || "Failed to reorder lists");
                if (board.lists) {
                    setLists([...board.lists].sort((a, b) => a.position - b.position));
                }
            }
        } catch (error) {
            toast.error("Failed to reorder lists");
            if (board.lists) {
                setLists([...board.lists].sort((a, b) => a.position - b.position));
            }
        }
    };

    const handleListDragStart = (e: React.DragEvent, listId: string) => {
        // Only start list drag if we're not dragging a card
        if (draggedCardId) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("dragType", "list");
        e.dataTransfer.setData("listId", listId);
        if (typeof window !== "undefined") {
            (window as any).__dragType = "list";
            (window as any).__dragListId = listId;
        }
        setDraggedListId(listId);
    };

    const handleListDragOver = (e: React.DragEvent, listId: string) => {
        e.preventDefault();
        // Only show list drag indicators when dragging a list (not a card)
        const isDraggingList = draggedListId || (typeof window !== "undefined" && (window as any).__dragType === "list");
        const isDraggingCard = draggedCardId || (typeof window !== "undefined" && (window as any).__dragType === "card");
        if (isDraggingList && draggedListId !== listId && !isDraggingCard) {
            setDraggedOverListId(listId);
        }
    };

    const handleListDragEnd = () => {
        if (typeof window !== "undefined") {
            delete (window as any).__dragType;
            delete (window as any).__dragListId;
        }
        setDraggedListId(null);
        setDraggedOverListId(null);
    };

    const handleListDrop = (e: React.DragEvent, targetListId: string) => {
        e.preventDefault();
        setDraggedOverListId(null);

        // CRITICAL: Only handle list drops, not card drops
        const dragType = e.dataTransfer.getData("dragType") || (typeof window !== "undefined" && (window as any).__dragType);
        if (dragType !== "list") return;

        const sourceId = e.dataTransfer.getData("listId") || (typeof window !== "undefined" && (window as any).__dragListId) || draggedListId;
        
        if (typeof window !== "undefined") {
            delete (window as any).__dragType;
            delete (window as any).__dragListId;
        }
        setDraggedListId(null);
        if (!sourceId || sourceId === targetListId) return;

        const sourceIndex = lists.findIndex(l => l.id === sourceId);
        const targetIndex = lists.findIndex(l => l.id === targetListId);
        if (sourceIndex === -1 || targetIndex === -1) return;

        // Reorder local array
        const updatedLists = [...lists];
        const [draggedList] = updatedLists.splice(sourceIndex, 1);
        updatedLists.splice(targetIndex, 0, draggedList);

        // Calculate new position
        let newPosition = 1000;
        if (targetIndex === 0) {
            newPosition = updatedLists[1] ? updatedLists[1].position / 2 : 1000;
        } else if (targetIndex === updatedLists.length - 1) {
            newPosition = updatedLists[updatedLists.length - 2] ? updatedLists[updatedLists.length - 2].position + 1000 : 2000;
        } else {
            const prevPos = updatedLists[targetIndex - 1].position;
            const nextPos = updatedLists[targetIndex + 1].position;
            newPosition = (prevPos + nextPos) / 2;
        }

        draggedList.position = newPosition;
        updatedLists.sort((a, b) => a.position - b.position);
        setLists(updatedLists);

        handleReorderLists(sourceId, newPosition);
    };

    // ==========================================
    // CARD DRAG & DROP
    // ==========================================

    const handleCardDragStart = (e: React.DragEvent, cardId: string, listId: string) => {
        if (typeof window !== "undefined") {
            (window as any).__dragType = "card";
            (window as any).__dragCardId = cardId;
            (window as any).__dragSourceListId = listId;
        }
        setDraggedCardId(cardId);
    };

    const handleCardDragEnd = () => {
        if (typeof window !== "undefined") {
            delete (window as any).__dragType;
            delete (window as any).__dragCardId;
            delete (window as any).__dragSourceListId;
        }
        setDraggedCardId(null);
    };

    const handleCardDrop = async (e: React.DragEvent, targetCardId: string | undefined, targetListId: string) => {
        e.preventDefault();
        const dragType = e.dataTransfer.getData("dragType") || (typeof window !== "undefined" && (window as any).__dragType);
        if (dragType !== "card") return;

        const cardId = e.dataTransfer.getData("cardId") || (typeof window !== "undefined" && (window as any).__dragCardId) || draggedCardId;
        let sourceListId = e.dataTransfer.getData("sourceListId") || (typeof window !== "undefined" && (window as any).__dragSourceListId);
        
        if (typeof window !== "undefined") {
            delete (window as any).__dragType;
            delete (window as any).__dragCardId;
            delete (window as any).__dragSourceListId;
        }
        setDraggedCardId(null);
        
        if (!cardId) return;

        // Auto-resolve source list ID if missing
        if (!sourceListId) {
            const listWithCard = lists.find(l => l.cards?.some((c: any) => c.id === cardId));
            if (listWithCard) {
                sourceListId = listWithCard.id;
            }
        }

        if (!sourceListId) return;

        // Don't do anything if dropped on itself in the same list with no target card
        if (sourceListId === targetListId && !targetCardId) return;
        // Don't do anything if dropped on itself
        if (cardId === targetCardId) return;

        // Deep clone lists to avoid mutating state directly
        const updatedLists = lists.map(l => ({
            ...l,
            cards: l.cards ? [...l.cards.map((c: any) => ({ ...c }))] : []
        }));

        const sourceList = updatedLists.find(l => l.id === sourceListId);
        const targetList = updatedLists.find(l => l.id === targetListId);
        if (!sourceList || !targetList) return;

        // Find and remove the card from source list
        const cardIndex = sourceList.cards.findIndex((c: any) => c.id === cardId);
        if (cardIndex === -1) return;
        const [draggedCard] = sourceList.cards.splice(cardIndex, 1);

        // Update card's list_id
        draggedCard.list_id = targetListId;

        // Determine target position index
        let insertIndex = targetList.cards.length; // Default: end of list
        if (targetCardId) {
            const idx = targetList.cards.findIndex((c: any) => c.id === targetCardId);
            if (idx !== -1) {
                insertIndex = idx;
            }
        }

        // Insert card into target list
        targetList.cards.splice(insertIndex, 0, draggedCard);

        // Calculate new position value
        let newPosition = 1000;
        if (targetList.cards.length === 1) {
            newPosition = 1000;
        } else if (insertIndex === 0) {
            newPosition = targetList.cards[1].position / 2;
        } else if (insertIndex === targetList.cards.length - 1) {
            newPosition = targetList.cards[targetList.cards.length - 2].position + 1000;
        } else {
            const prevPos = targetList.cards[insertIndex - 1].position;
            const nextPos = targetList.cards[insertIndex + 1].position;
            newPosition = (prevPos + nextPos) / 2;
        }

        draggedCard.position = newPosition;

        // Sort cards by position in target list
        targetList.cards.sort((a: any, b: any) => a.position - b.position);

        // Update state immediately (optimistic)
        setLists(updatedLists);

        // Call API
        try {
            const res = await moveCard(board.id, cardId, {
                targetListId,
                position: newPosition
            }, projectId);
            if (!res.success) {
                toast.error(res.message || "Failed to move card");
                // Revert
                if (board.lists) {
                    setLists([...board.lists].sort((a, b) => a.position - b.position));
                }
            }
        } catch (error) {
            toast.error("Failed to move card");
            if (board.lists) {
                setLists([...board.lists].sort((a, b) => a.position - b.position));
            }
        }
    };

    return (
        <div className="flex flex-col font-sans h-screen w-full overflow-hidden">
            {/* Modular Board Header */}
            <BoardHeader board={board} projectId={projectId} />

            {/* Board Canvas */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 min-h-0">
                <div className="flex items-start gap-4 h-full pb-4">
                    {lists?.map((list) => (
                        <div
                            key={list.id}
                            draggable={!draggedCardId}
                            onDragStart={(e) => handleListDragStart(e, list.id)}
                            onDragOver={(e) => handleListDragOver(e, list.id)}
                            onDragEnd={handleListDragEnd}
                            onDrop={(e) => handleListDrop(e, list.id)}
                            className={`h-full flex-shrink-0 transition-all duration-300 ${
                                !draggedCardId ? "cursor-grab active:cursor-grabbing" : ""
                            } ${
                                draggedListId === list.id ? "opacity-30 scale-95" : ""
                            } ${
                                draggedOverListId === list.id && !draggedCardId ? "border-2 border-dashed border-gray-400/50 rounded-2xl bg-gray-200/5 scale-102 mx-2" : ""
                            }`}
                        >
                            <BoardList
                                list={list}
                                addingCardToListId={addingCardToListId}
                                setAddingCardToListId={setAddingCardToListId}
                                newCardTitle={newCardTitle}
                                setNewCardTitle={setNewCardTitle}
                                isSubmittingCard={isSubmittingCard}
                                handleCreateCard={handleCreateCard}
                                onCardClick={setSelectedCard}
                                onCompleteCard={handleCompleteCard}
                                onCardDragStart={handleCardDragStart}
                                onCardDragEnd={handleCardDragEnd}
                                onCardDrop={handleCardDrop}
                                draggedCardId={draggedCardId}
                            />
                        </div>
                    ))}

                    {/* Add List Button / Form */}
                    {isAddingList ? (
                        <div className="w-72 flex-shrink-0 silver-metallic rounded-2xl p-3 border border-gray-300 shadow-lg h-fit">
                            <input
                                type="text"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                placeholder="Enter list title..."
                                className="w-full silver-input text-gray-850 placeholder:text-gray-400 mb-2 focus:outline-none"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateList();
                                    if (e.key === 'Escape') {
                                        setIsAddingList(false);
                                        setNewListName("");
                                    }
                                }}
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCreateList}
                                    disabled={isSubmittingList || !newListName.trim()}
                                    className="silver-btn text-xs font-semibold px-3 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmittingList ? "Adding..." : "Add list"}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAddingList(false);
                                        setNewListName("");
                                    }}
                                    className="p-2 text-gray-500 hover:text-gray-850 hover:bg-gray-250/50 rounded-xl transition cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-72 flex-shrink-0">
                            <button
                                onClick={() => setIsAddingList(true)}
                                className="flex items-center gap-2 text-xs font-semibold text-gray-650 bg-gray-200/50 hover:bg-gray-300/60 w-full p-3.5 rounded-2xl transition-all border border-gray-300 cursor-pointer shadow-sm"
                            >
                                <Plus size={15} />
                                Add another list
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.12);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.22);
                }
                
                /* For the main board scrollbar */
                ::-webkit-scrollbar {
                    height: 8px;
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 8px;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.15);
                    border-radius: 8px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(0,0,0,0.25);
                }
            `}} />

            {/* Card Details Modal */}
            {selectedCard && (
                <CardDetailsModal
                    card={selectedCard}
                    board={board}
                    projectId={projectId}
                    onClose={() => setSelectedCard(null)}
                />
            )}
        </div>
    );
}
