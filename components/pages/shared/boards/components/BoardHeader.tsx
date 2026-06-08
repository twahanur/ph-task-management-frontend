/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, UserPlus, Share2, Filter, MoreHorizontal, Copy, Home, ChevronRight, LayoutGrid, X } from "lucide-react";
import { toggleStarBoard, copyBoard, addBoardMember } from "@/service/boardService/board.service";
import { toast } from "sonner";
import NotificationBell from "./NotificationBell";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface BoardHeaderProps {
  board: any;
  projectId?: string;
}

export default function BoardHeader({ board, projectId }: BoardHeaderProps) {
  const [starred, setStarred] = useState(board.isStarred);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsInviteOpen(false);
      }
    }
    if (isInviteOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInviteOpen]);

  useEffect(() => {
    setStarred(board.isStarred);
  }, [board.isStarred]);

  const handleToggleStar = async () => {
    const nextStarred = !starred;
    setStarred(nextStarred);
    try {
      const res = await toggleStarBoard(board.id, board.workspace_id);
      if (!res.success) {
        setStarred(!nextStarred); // Revert
        toast.error(res.message || "Failed to update star status");
      }
    } catch (error) {
      setStarred(!nextStarred); // Revert
      toast.error("Failed to update star status");
    }
  };

  const handleCopyBoard = async () => {
    if (!confirm(`Are you sure you want to copy the board "${board.name}"?`)) return;
    try {
      const res = await copyBoard(board.id, board.workspace_id);
      if (!res.success) {
        toast.error(res.message || "Failed to copy board");
      }
    } catch (error) {
      toast.error("Failed to copy board");
    }
  };

  const handleInviteMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsSubmitting(true);
    try {
      const res = await addBoardMember(board.id, board.workspace_id, {
        email: inviteEmail,
        role: inviteRole,
      });
      if (res?.success) {
        toast.success(res.message || "Member invited to board successfully!");
        setIsInviteOpen(false);
        setInviteEmail("");
        setInviteRole("member");
      } else {
        toast.error(res?.message || "Failed to invite member");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const workspaceId = projectId || board.workspace_id;

  return (
    <div className="silver-metallic px-4 py-3 flex flex-wrap items-center justify-between z-20 sticky top-0 gap-3 border-b border-gray-300 shadow-md">
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-1.5 mr-2">
          <Link 
            href="/dashboard/projects" 
            className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors p-1.5 rounded-lg hover:bg-gray-250/50"
            title="All Workspaces"
          >
            <Home size={15} />
          </Link>
          <ChevronRight size={13} className="text-gray-450" />
          {workspaceId && (
            <>
              <Link 
                href={`/projects/${workspaceId}`}
                className="text-xs text-gray-500 hover:text-gray-850 transition-colors"
              >
                Workspace
              </Link>
              <ChevronRight size={13} className="text-gray-450" />
            </>
          )}
        </div>

        <h1 className="text-sm font-bold text-gray-800 px-2.5 py-1.5 rounded-lg silver-metallic border border-gray-300 transition cursor-pointer">
          {board.name}
        </h1>
        
        {/* Star Button */}
        <button 
          onClick={handleToggleStar}
          className="text-slate-400 hover:text-gray-700 p-2 rounded-lg silver-metallic border border-gray-300 transition duration-200 active:scale-95 cursor-pointer"
        >
          <Star 
            size={15} 
            className={starred ? "fill-gray-700 text-gray-700" : "transition-colors"} 
          />
        </button>

        {/* Copy Button */}
        <button 
          onClick={handleCopyBoard}
          className="text-slate-400 hover:text-gray-700 p-2 rounded-lg silver-metallic border border-gray-300 transition duration-200 active:scale-95 cursor-pointer"
          title="Copy Board"
        >
          <Copy size={15} />
        </button>

        {/* Visibility */}
        <button className="text-xs font-medium text-gray-600 px-3 py-2 rounded-lg silver-metallic border border-gray-300 transition capitalize">
          {board.visibility || 'Workspace'}
        </button>

        {/* Mode switcher */}
        <button className="text-xs font-medium text-gray-600 px-3 py-2 rounded-lg silver-metallic border border-gray-300 transition">
          Board View
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1"></div>

        {/* Member Stack */}
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-2">
            {board.members?.slice(0, 5).map((member: any, i: number) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div 
                    className="w-8 h-8 rounded-full bg-gray-250 flex items-center justify-center text-xs font-bold ring-2 ring-white hover:ring-gray-300 transition cursor-pointer z-10 hover:z-20 text-gray-700"
                  >
                    {member.user?.avatar_url ? (
                      <img src={member.user.avatar_url} alt={member.user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      member.user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-905 text-white border border-white/10 p-2 rounded-lg shadow-xl text-xs z-50">
                  <p className="font-bold text-slate-100">{member.user?.name || "User"}</p>
                  <p className="text-[10px] text-slate-400">{member.user?.email || "No email"}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div className="relative" ref={popoverRef}>
            <button 
              onClick={() => setIsInviteOpen(!isInviteOpen)}
              className="w-8 h-8 rounded-full silver-metallic border border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-755 transition active:scale-95 cursor-pointer"
              title="Invite member"
            >
              <UserPlus size={13} />
            </button>
            
            {isInviteOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 silver-metallic border border-gray-300 rounded-xl shadow-xl z-30 p-3">
                <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-200">
                  <h4 className="text-xs font-bold text-gray-800">Invite to Board</h4>
                  <button 
                    onClick={() => setIsInviteOpen(false)} 
                    className="text-gray-400 hover:text-gray-650 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
                <form onSubmit={handleInviteMember} className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="invite-email" className="text-[10px] font-semibold text-gray-600">
                      Email Address <span className="text-gray-700">*</span>
                    </label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="member@demo.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      className="h-8 text-xs bg-transparent border-gray-300 text-gray-850 placeholder:text-gray-400 focus-visible:ring-gray-400"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-600">
                      Role
                    </label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger className="h-8 text-xs bg-transparent border-gray-300 text-gray-850 focus:ring-gray-400">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="silver-metallic border-gray-300 text-gray-850">
                        <SelectItem value="member" className="text-xs focus:bg-gray-100 focus:text-gray-900">Member</SelectItem>
                        <SelectItem value="admin" className="text-xs focus:bg-gray-100 focus:text-gray-900">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 silver-btn text-xs font-bold py-1.5 rounded cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Inviting..." : "Invite Member"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <NotificationBell />

        {/* Share Button */}
        <button className="silver-btn flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition duration-150 active:scale-95 cursor-pointer shadow-sm">
          <Share2 size={13} className="stroke-[2.5px]" />
          Share
        </button>
        
        {/* Filter Button */}
        <button className="silver-btn p-2 rounded-lg transition flex items-center gap-1.5 px-3.5 text-xs font-medium cursor-pointer">
          <Filter size={13} />
          <span>Filter</span>
        </button>
        
        {/* More Actions Button */}
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg silver-metallic border border-gray-300 transition cursor-pointer">
          <MoreHorizontal size={15} />
        </button>
      </div>
    </div>
  );
}
