/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import BoardCard from "./BoardCard";

interface BoardListProps {
  list: any;
  addingCardToListId: string | null;
  setAddingCardToListId: (id: string | null) => void;
  newCardTitle: string;
  setNewCardTitle: (title: string) => void;
  isSubmittingCard: boolean;
  handleCreateCard: (listId: string) => Promise<void>;
  onCardClick: (card: any) => void;
  onCompleteCard: (cardId: string, currentStatus: string) => Promise<void>;
  onCardDragStart?: (e: React.DragEvent, cardId: string, listId: string) => void;
  onCardDragEnd?: () => void;
  onCardDrop?: (e: React.DragEvent, targetCardId: string | undefined, targetListId: string) => void;
  draggedCardId?: string | null;
}

export default function BoardList({
  list,
  addingCardToListId,
  setAddingCardToListId,
  newCardTitle,
  setNewCardTitle,
  isSubmittingCard,
  handleCreateCard,
  onCardClick,
  onCompleteCard,
  onCardDragStart,
  onCardDragEnd,
  onCardDrop,
  draggedCardId,
}: BoardListProps) {
  const isAddingCard = addingCardToListId === list.id;
  const [listDraggedOver, setListDraggedOver] = useState(false);
  const { can } = useRole();

  return (
    <div className="silver-metallic rounded-2xl w-72 flex-shrink-0 max-h-full flex flex-col border border-gray-300 shadow-lg">
      {/* List Header */}
      <div className="p-3.5 pb-2 flex items-center justify-between cursor-pointer group">
        <h3 className="font-semibold text-gray-800 text-sm px-2 py-1 rounded focus:outline-none w-full mr-2 truncate">
          {list.name}
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[10px] font-bold text-gray-550 bg-gray-200 px-2 py-0.5 rounded-full border border-gray-300">
            {list.cards?.length || 0}
          </span>
          <button className="text-gray-500 hover:text-gray-800 transition p-1.5 hover:bg-gray-200/50 rounded-lg">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Cards Container - this is the drop zone for cards */}
      <div 
        onDragOver={(e) => {
          e.preventDefault();
          // Only show drop indicator when a card is being dragged
          const isDraggingCard = draggedCardId || (typeof window !== "undefined" && (window as any).__dragType === "card");
          if (isDraggingCard) {
            setListDraggedOver(true);
          }
        }}
        onDragLeave={() => {
          setListDraggedOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation(); // prevent list wrapper drop from triggering
          setListDraggedOver(false);
          const dragType = e.dataTransfer.getData("dragType") || (typeof window !== "undefined" && (window as any).__dragType);
          if (dragType === "card" && onCardDrop) {
            onCardDrop(e, undefined, list.id);
          }
        }}
        className={`flex-1 overflow-y-auto px-2.5 pb-2.5 space-y-2.5 custom-scrollbar min-h-[60px] transition-all duration-200 ${
          listDraggedOver && draggedCardId ? "bg-gray-200/10 rounded-xl border border-dashed border-gray-400" : ""
        }`}
      >
        {list.cards?.map((card: any) => (
          <BoardCard
            key={card.id}
            card={card}
            onClick={() => onCardClick(card)}
            onComplete={onCompleteCard}
            onDragStart={onCardDragStart}
            onDragEnd={() => {
              setListDraggedOver(false);
              if (onCardDragEnd) onCardDragEnd();
            }}
            onDrop={(e, targetCardId, targetListId) => {
              if (onCardDrop) {
                onCardDrop(e, targetCardId, targetListId);
              }
            }}
            isDragging={draggedCardId === card.id}
          />
        ))}
      </div>

      {/* Add Card Button / Form */}
      {isAddingCard ? (
        <div className="p-2.5 pt-1.5 border-t border-gray-250 bg-gray-50/10 rounded-b-2xl">
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter a title for this card..."
            className="w-full silver-input text-gray-850 placeholder:text-gray-400 mb-2 resize-none focus:outline-none"
            autoFocus
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCreateCard(list.id);
              }
              if (e.key === "Escape") {
                setAddingCardToListId(null);
                setNewCardTitle("");
              }
            }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCreateCard(list.id)}
              disabled={isSubmittingCard || !newCardTitle.trim()}
              className="silver-btn text-xs font-semibold px-3 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmittingCard ? "Adding..." : "Add Card"}
            </button>
            <button
              onClick={() => {
                setAddingCardToListId(null);
                setNewCardTitle("");
              }}
              className="p-2 text-gray-500 hover:text-gray-850 hover:bg-gray-250/50 rounded-xl transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2.5 pt-1.5 border-t border-gray-200">
          <button
            onClick={() => can("CREATE_TASK") && setAddingCardToListId(list.id)}
            disabled={!can("CREATE_TASK")}
            title={!can("CREATE_TASK") ? "Only Admin or Project Manager can create tasks" : undefined}
            className="flex items-center gap-2 text-xs font-semibold text-gray-550 hover:text-gray-855 hover:bg-gray-200/50 w-full p-2.5 rounded-xl transition-all group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={15} />
            <span>Add a card</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-300/40 rounded-md transition-opacity">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
