"use client";

import React, { useState, useEffect } from 'react';
import { TBoard, TBoardDetails } from '@/types/baordType/board.type';
import Link from 'next/link';
import { Star, Copy, AlertCircle, Clock, Layers, Users, MessageSquare, Paperclip, CheckSquare, Settings } from 'lucide-react';
import { toggleStarBoard, copyBoard, getBoardById } from '@/service/boardService/board.service';
import { toast } from 'sonner';

function BoardCard({ 
    board, 
    workspaceId, 
    handleToggleStar, 
    handleCopyBoard, 
    togglingStarId, 
    copyingBoardId 
}: {
    board: TBoard;
    workspaceId: string;
    handleToggleStar: (e: React.MouseEvent, boardId: string, isStarred: boolean) => void;
    handleCopyBoard: (e: React.MouseEvent, boardId: string, boardName: string) => void;
    togglingStarId: string | null;
    copyingBoardId: string | null;
}) {
    const [details, setDetails] = useState<TBoardDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        let active = true;
        
        getBoardById(board.id)
            .then((res) => {
                if (res.success && active) {
                    setDetails(res.data);
                }
            })
            .catch(() => {
                // Silently fallback if error
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [board.id]);

    const formattedDate = mounted && board.created_at
        ? new Date(board.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';

    // Calculate cards stats
    let todoCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let totalCards = 0;
    let highPriorityCount = 0;
    let overdueCount = 0;
    let totalComments = 0;
    let totalChecklists = 0;
    let totalAttachments = 0;
    const now = new Date();

    if (details?.lists) {
        details.lists.forEach(list => {
            if (list.cards) {
                list.cards.forEach(card => {
                    totalCards++;
                    if (card.status === 'completed') {
                        completedCount++;
                    } else if (card.status === 'in_progress') {
                        inProgressCount++;
                    } else {
                        todoCount++;
                    }

                    if (card.priority === 'high') {
                        highPriorityCount++;
                    }

                    if (card.due_date && card.status !== 'completed') {
                        const dueDate = new Date(card.due_date);
                        if (dueDate < now) {
                            overdueCount++;
                        }
                    }

                    totalComments += card.commentsCount || 0;
                    totalChecklists += card.checklistsCount || 0;
                    totalAttachments += card.attachmentsCount || 0;
                });
            }
        });
    }

    const progressPercent = totalCards > 0 ? Math.round((completedCount / totalCards) * 100) : 0;

    return (
        <Link 
            href={`/projects/${workspaceId}/${board.id}`} 
            className="block group min-h-[220px] rounded-lg relative overflow-hidden transition-all hover:ring-2 hover:ring-gray-400 flex flex-col justify-between border border-gray-250 shadow-sm hover:shadow-md"
            style={{ 
                backgroundColor: board.background_color || '#E5E7EB',
                backgroundImage: board.cover_image_url ? `url(${board.cover_image_url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Dark overlay for better text readability if there's an image */}
            {(board.cover_image_url || board.background_color) && <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />}
            
            <div className="relative z-10 p-4 h-full flex flex-col justify-between flex-1">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-white font-bold text-base truncate drop-shadow-md" title={board.name}>
                            {board.name}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={(e) => handleToggleStar(e, board.id, board.isStarred)}
                                disabled={togglingStarId === board.id}
                                className={`p-1 rounded-lg bg-black/30 hover:bg-black/50 border border-white/5 transition cursor-pointer ${board.isStarred ? 'text-gray-700 opacity-100 animate-none' : 'text-slate-400 hover:text-gray-700'}`}
                                title={board.isStarred ? "Unstar Board" : "Star Board"}
                            >
                                <Star
                                    size={10}
                                    className={`${togglingStarId === board.id ? "animate-pulse scale-110" : ""} ${board.isStarred ? "fill-gray-700 text-gray-700" : "text-white/70"}`}
                                />
                            </button>
                            <button
                                onClick={(e) => handleCopyBoard(e, board.id, board.name)}
                                disabled={copyingBoardId === board.id}
                                className=" text-white/70 hover:text-white p-1 rounded-lg bg-black/30 hover:bg-black/50 border border-white/5 transition cursor-pointer"
                                title="Copy Board"
                            >
                                <Copy size={10} className={copyingBoardId === board.id ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-white/90 text-[11px] mt-1 line-clamp-2 drop-shadow-sm min-h-[30px] leading-relaxed">
                        {board.description || "No description provided."}
                    </p>
                </div>

                {/* Summary Statistics */}
                {loading ? (
                    <div className="mt-3 bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/5 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                ) : details ? (
                    <div className="mt-3 bg-black/20 backdrop-blur-md rounded-lg p-2.5 border border-white/10 space-y-2.5">
                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between items-center text-[9px] font-bold text-white/95 uppercase tracking-wide">
                                <span>Progress</span>
                                <span>{completedCount}/{totalCards} ({progressPercent}%)</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1 mt-1 overflow-hidden">
                                <div 
                                    className="silver-btn h-1 rounded-full transition-all duration-300" 
                                    style={{ width: `${progressPercent}%` }} 
                                />
                            </div>
                        </div>
                        
                        {/* Mini Stats Breakdown */}
                        <div className="grid grid-cols-3 gap-1 text-center text-[9px] text-white/95 font-semibold">
                            <div className="bg-white/5 rounded py-0.5">
                                <span className="block text-white/60 text-[7px] uppercase font-bold tracking-wider">Todo</span>
                                <span>{todoCount}</span>
                            </div>
                            <div className="bg-white/5 rounded py-0.5">
                                <span className="block text-white/60 text-[7px] uppercase font-bold tracking-wider">Doing</span>
                                <span>{inProgressCount}</span>
                            </div>
                            <div className="bg-white/5 rounded py-0.5">
                                <span className="block text-white/60 text-[7px] uppercase font-bold tracking-wider">Done</span>
                                <span>{completedCount}</span>
                            </div>
                        </div>

                        {/* Extra stats row */}
                        <div className="grid grid-cols-3 gap-y-1.5 gap-x-1 pt-2 border-t border-white/10 text-[8px] text-white/85 font-semibold">
                            <div className="flex items-center gap-0.5" title="Lists count">
                                <Layers size={8} className="text-white/60 shrink-0" />
                                <span className="truncate">{details.lists.length} List{details.lists.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-0.5" title="Members count">
                                <Users size={8} className="text-white/60 shrink-0" />
                                <span className="truncate">{details.members.length} Member{details.members.length !== 1 ? 's' : ''}</span>
                            </div>
                            {details.custom_fields && details.custom_fields.length > 0 && (
                                <div className="flex items-center gap-0.5" title="Custom fields">
                                    <Settings size={8} className="text-white/60 shrink-0" />
                                    <span className="truncate">{details.custom_fields.length} Field{details.custom_fields.length !== 1 ? 's' : ''}</span>
                                </div>
                            )}
                            {totalComments > 0 && (
                                <div className="flex items-center gap-0.5" title="Comments count">
                                    <MessageSquare size={8} className="text-white/60 shrink-0" />
                                    <span className="truncate">{totalComments} Msg{totalComments !== 1 ? 's' : ''}</span>
                                </div>
                            )}
                            {totalChecklists > 0 && (
                                <div className="flex items-center gap-0.5" title="Checklists count">
                                    <CheckSquare size={8} className="text-white/60 shrink-0" />
                                    <span className="truncate">{totalChecklists} Check</span>
                                </div>
                            )}
                            {totalAttachments > 0 && (
                                <div className="flex items-center gap-0.5" title="Attachments count">
                                    <Paperclip size={8} className="text-white/60 shrink-0" />
                                    <span className="truncate">{totalAttachments} File{totalAttachments !== 1 ? 's' : ''}</span>
                                </div>
                            )}
                        </div>

                        {/* Alerts */}
                        {(highPriorityCount > 0 || overdueCount > 0) && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                                {highPriorityCount > 0 && (
                                    <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded silver-btn text-white border border-gray-300 shadow-sm shrink-0">
                                        <AlertCircle size={8} />
                                        {highPriorityCount} High
                                    </span>
                                )}
                                {overdueCount > 0 && (
                                    <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded silver-btn text-white border border-gray-300 shadow-sm animate-pulse shrink-0">
                                        <Clock size={8} />
                                        {overdueCount} Overdue
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ) : null}
                
                {/* Footer details */}
                <div className="mt-3 flex flex-col gap-1 border-t border-white/10 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                        <span className="text-[9px] font-bold backdrop-blur-md bg-black/40 text-white/90 px-1.5 py-0.5 rounded capitalize border border-white/5">
                            {board.visibility}
                        </span>
                        {board.status && (
                            <span className={`text-[9px] font-bold backdrop-blur-md px-1.5 py-0.5 rounded capitalize border border-white/5 ${board.status === 'active' ? 'silver-btn text-gray-700' : 'bg-gray-500/40 text-gray-200'}`}>
                                {board.status}
                            </span>
                        )}
                    </div>
                    <div className="text-[9px] text-white/75 font-semibold drop-shadow-sm mt-0.5 flex justify-between items-center">
                        {formattedDate ? <span>Created {formattedDate}</span> : <span />}
                        {details && <span className="text-white/80">By {details.creator?.name || 'Owner'}</span>}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function BoardsList({ boards, workspaceId }: { boards: TBoard[], workspaceId: string }) {
    const [localBoards, setLocalBoards] = useState<TBoard[]>(boards);
    const [togglingStarId, setTogglingStarId] = useState<string | null>(null);
    const [copyingBoardId, setCopyingBoardId] = useState<string | null>(null);

    useEffect(() => {
        setLocalBoards(boards);
    }, [boards]);

    const handleToggleStar = async (e: React.MouseEvent, boardId: string, isStarred: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (togglingStarId) return;
        setTogglingStarId(boardId);

        // Optimistic UI update
        setLocalBoards(prev => 
            prev.map(b => b.id === boardId ? { ...b, isStarred: !b.isStarred } : b)
        );

        try {
            const res = await toggleStarBoard(boardId, workspaceId);
            if (!res.success) {
                // Revert on failure
                setLocalBoards(prev => 
                    prev.map(b => b.id === boardId ? { ...b, isStarred: isStarred } : b)
                );
                toast.error(res.message || "Failed to update star status");
            }
        } catch (error) {
            // Revert on failure
            setLocalBoards(prev => 
                prev.map(b => b.id === boardId ? { ...b, isStarred: isStarred } : b)
            );
            toast.error("Failed to update star status");
        } finally {
            setTogglingStarId(null);
        }
    };

    const handleCopyBoard = async (e: React.MouseEvent, boardId: string, boardName: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (copyingBoardId) return;
        if (!confirm(`Are you sure you want to copy the board "${boardName}"?`)) return;
        setCopyingBoardId(boardId);
        try {
            const res = await copyBoard(boardId, workspaceId);
            if (!res.success) {
                toast.error(res.message || "Failed to copy board");
            }
        } catch (error) {
            toast.error("Failed to copy board");
        } finally {
            setCopyingBoardId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {localBoards?.map((board) => (
                <BoardCard 
                    key={board.id}
                    board={board}
                    workspaceId={workspaceId}
                    handleToggleStar={handleToggleStar}
                    handleCopyBoard={handleCopyBoard}
                    togglingStarId={togglingStarId}
                    copyingBoardId={copyingBoardId}
                />
            ))}
            
            {(!localBoards || localBoards.length === 0) && (
                <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                    No boards found. Create a new board to get started!
                </div>
            )}
        </div>
    );
}
