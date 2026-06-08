/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { AlignLeft, MessageSquare, Paperclip, CheckSquare, Clock } from "lucide-react";

interface BoardCardProps {
  card: any;
  onClick: () => void;
  onComplete: (cardId: string, currentStatus: string) => Promise<void>;
  onDragStart?: (e: React.DragEvent, cardId: string, listId: string) => void;
  onDragEnd?: () => void;
  onDrop?: (e: React.DragEvent, targetCardId: string, targetListId: string) => void;
  isDragging?: boolean;
}

export default function BoardCard({ 
  card, 
  onClick, 
  onComplete,
  onDragStart,
  onDragEnd,
  onDrop,
  isDragging,
}: BoardCardProps) {
  const [draggedOver, setDraggedOver] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Check if due date is overdue
  const isOverdue = card.due_date ? new Date(card.due_date) < new Date() : false;

  return (
    <div
      onClick={onClick}
      draggable
      onDragStart={(e) => {
        e.stopPropagation(); // CRITICAL: prevent list drag from triggering
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("dragType", "card");
        e.dataTransfer.setData("cardId", card.id);
        e.dataTransfer.setData("sourceListId", card.list_id);
        if (typeof window !== "undefined") {
          (window as any).__dragType = "card";
          (window as any).__dragCardId = card.id;
          (window as any).__dragSourceListId = card.list_id;
        }
        if (onDragStart) onDragStart(e, card.id, card.list_id);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        setDraggedOver(false);
        if (typeof window !== "undefined") {
          delete (window as any).__dragType;
          delete (window as any).__dragCardId;
          delete (window as any).__dragSourceListId;
        }
        if (onDragEnd) onDragEnd();
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggedOver(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setDraggedOver(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation(); // CRITICAL: prevent list drop from triggering
        setDraggedOver(false);
        // Only handle card drops, not list drops
        const dragType = e.dataTransfer.getData("dragType") || (typeof window !== "undefined" && (window as any).__dragType);
        if (dragType === "card" && onDrop) {
          onDrop(e, card.id, card.list_id);
        }
      }}
      className={`bg-white hover:bg-gray-50/80 text-gray-800 p-3.5 rounded-xl shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing group transition-all duration-200 hover:-translate-y-0.5 border ${
        card.status === "completed"
          ? "border-emerald-400 bg-emerald-50/35 hover:bg-emerald-50/50"
          : "border-gray-300 hover:border-gray-400"
      } ${isDragging ? "opacity-30 scale-95 border-gray-400" : ""} ${
        draggedOver ? "border-t-2 border-t-gray-500 pt-5 mt-1" : ""
      }`}
    >
      {/* Cover Image */}
      {card.cover_image_url && (
        <div
          className="h-32 -mx-3.5 -mt-3.5 mb-3 rounded-t-xl bg-cover bg-center border-b border-gray-250"
          style={{ backgroundImage: `url(${card.cover_image_url})` }}
        />
      )}

      {/* Cover Color */}
      {card.cover_color && !card.cover_image_url && (
        <div
          className="h-6 -mx-3.5 -mt-3.5 mb-3 rounded-t-xl"
          style={{ backgroundColor: card.cover_color }}
        />
      )}

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {card.labels.map((label: any, idx: number) => (
            <span
              key={idx}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${label.color || '#3b82f6'}20`,
                color: label.color || '#3b82f6',
                border: `1px solid ${label.color || '#3b82f6'}30`
              }}
              title={label.name}
            >
              {label.name || "Label"}
            </span>
          ))}
        </div>
      )}

      {/* Card Title & Checkbox */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <button
          onClick={async (e) => {
            e.stopPropagation(); // Stop click from bubbling to the card div (which opens the modal)
            if (isUpdating) return;
            setIsUpdating(true);
            try {
              await onComplete(card.id, card.status || "todo");
            } finally {
              setIsUpdating(false);
            }
          }}
          disabled={isUpdating}
          className={`w-4.5 h-4.5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all mt-0.5 cursor-pointer ${
            isUpdating
              ? "border-gray-400 bg-transparent cursor-not-allowed"
              : card.status === "completed"
              ? "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600"
              : "border-gray-400 hover:border-emerald-500 bg-transparent hover:bg-emerald-50"
          }`}
          title={card.status === "completed" ? "Mark as incompleted" : "Mark as completed"}
        >
          {isUpdating ? (
            <svg className="animate-spin h-2.5 w-2.5 text-slate-450" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : card.status === "completed" ? (
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </button>
        <p className={`text-sm font-medium leading-snug transition-colors flex-1 ${
          card.status === "completed"
            ? "line-through text-gray-400 group-hover:text-gray-550"
            : "text-gray-800 group-hover:text-gray-950"
        }`}>
          {card.title}
        </p>
      </div>

      {/* Badges / Footer */}
      <div className="flex items-center justify-between text-gray-500 text-xs">
        <div className="flex items-center gap-2.5">
          {card.description && (
            <div className="flex items-center hover:text-gray-800 transition" title="This card has a description">
              <AlignLeft size={14} />
            </div>
          )}
          
          {card.commentsCount > 0 && (
            <div className="flex items-center gap-1 hover:text-gray-800 transition" title="Comments">
              <MessageSquare size={14} />
              <span className="text-[11px] font-medium">{card.commentsCount}</span>
            </div>
          )}
          
          {card.attachmentsCount > 0 && (
            <div className="flex items-center gap-1 hover:text-gray-800 transition" title="Attachments">
              <Paperclip size={14} />
              <span className="text-[11px] font-medium">{card.attachmentsCount}</span>
            </div>
          )}
          
          {card.checklistsCount > 0 && (
            <div 
              className="flex items-center gap-1 bg-emerald-50/60 text-emerald-600 border border-emerald-250 px-1.5 py-0.5 rounded-md hover:bg-emerald-100 transition"
              title="Checklist items"
            >
              <CheckSquare size={12} className="stroke-[2.5px]" />
              <span className="text-[10px] font-bold">{card.checklistsCount}</span>
            </div>
          )}
          
          {card.due_date && (
            <div 
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border transition ${
                isOverdue 
                  ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200" 
                  : "bg-gray-150 text-gray-600 border-gray-250 hover:bg-gray-200"
              }`}
              title={isOverdue ? "Overdue!" : "Due date"}
            >
              <Clock size={12} />
              <span className="text-[10px] font-medium">
                {new Date(card.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Card Members */}
        {card.members && card.members.length > 0 && (
          <div className="flex -space-x-1.5">
            {card.members.map((member: any, idx: number) => {
              const userObj = member.user || member;
              const name = userObj.name || "User";
              const avatar = userObj.avatar_url || userObj.avatar_secure_url;
              const initials = name.charAt(0).toUpperCase();

              return (
                <div 
                  key={idx} 
                  className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[10px] font-bold z-10 hover:z-20 transition-all hover:scale-110 shadow overflow-hidden text-gray-700"
                  title={name}
                >
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
