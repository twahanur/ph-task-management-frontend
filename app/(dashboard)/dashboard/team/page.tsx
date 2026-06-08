"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { getAllWorkspaces, updateWorkspaceMemberRole, removeWorkspaceMember, addWorkspaceMember } from "@/service/workspaceService/workspace.service";
import { Workspace } from "@/types/projectType/project.type";
import { toast } from "sonner";
import { Trash2, Shield, User, Search, RefreshCw, Layers, UserPlus, X, Briefcase } from "lucide-react";

export default function TeamPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  
  // Invite workspace member states
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

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const res = await getAllWorkspaces();
      if (res.success) {
        setWorkspaces(res.data || []);
      } else {
        toast.error("Failed to fetch workspaces");
      }
    } catch (error) {
      toast.error("An error occurred while loading workspaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleRoleChange = async (userId: string, newRole: "admin" | "member") => {
    if (selectedWorkspaceId === "all") return;
    setUpdatingUserId(userId);
    try {
      const res = await updateWorkspaceMemberRole(selectedWorkspaceId, userId, { role: newRole });
      if (res.success) {
        toast.success("Role updated successfully");
        // Refresh local data
        setWorkspaces(prev => 
          prev.map(w => {
            if (w.id === selectedWorkspaceId) {
              return {
                ...w,
                members: w.members.map(m => 
                  m.user_id === userId ? { ...m, role: newRole } : m
                )
              };
            }
            return w;
          })
        );
      } else {
        toast.error(res.message || "Failed to update role");
      }
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (selectedWorkspaceId === "all") return;
    if (removingUserId) return;
    if (!confirm(`Are you sure you want to remove ${userName} from this workspace?`)) return;
    setRemovingUserId(userId);
    try {
      const res = await removeWorkspaceMember(selectedWorkspaceId, userId);
      if (res.success) {
        toast.success("Member removed successfully");
        // Update local state
        setWorkspaces(prev => 
          prev.map(w => {
            if (w.id === selectedWorkspaceId) {
              return {
                ...w,
                members: w.members.filter(m => m.user_id !== userId)
              };
            }
            return w;
          })
        );
      } else {
        toast.error(res.message || "Failed to remove member");
      }
    } catch (error) {
      toast.error("Failed to remove member");
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleInviteMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inviteEmail || selectedWorkspaceId === "all") return;
    setIsSubmitting(true);
    try {
      const res = await addWorkspaceMember(selectedWorkspaceId, {
        email: inviteEmail,
        role: inviteRole,
      });
      if (res?.success) {
        toast.success(res.message || "Member added to workspace successfully!");
        setIsInviteOpen(false);
        setInviteEmail("");
        setInviteRole("member");
        await fetchWorkspaces();
      } else {
        toast.error(res?.message || "Failed to invite member");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract all unique members from all workspaces
  const allUniqueMembers = useMemo(() => {
    const memberMap = new Map<string, { user: any; joined_at: string; role: string; workspaces: string[] }>();
    
    workspaces.forEach(ws => {
      ws.members?.forEach(m => {
        if (!m.user) return;
        const userId = m.user.id;
        const existing = memberMap.get(userId);
        if (existing) {
          if (!existing.workspaces.includes(ws.name)) {
            existing.workspaces.push(ws.name);
          }
        } else {
          memberMap.set(userId, {
            user: m.user,
            joined_at: m.joined_at,
            role: m.role,
            workspaces: [ws.name],
          });
        }
      });
    });
    
    return Array.from(memberMap.values());
  }, [workspaces]);

  // Filter and format members
  const displayedMembers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    if (selectedWorkspaceId === "all") {
      return allUniqueMembers.filter(m => 
        m.user?.name?.toLowerCase().includes(query) ||
        m.user?.email?.toLowerCase().includes(query)
      );
    } else {
      const selectedWorkspace = workspaces.find(w => w.id === selectedWorkspaceId);
      const members = selectedWorkspace?.members || [];
      return members
        .filter(m => 
          m.user?.name?.toLowerCase().includes(query) ||
          m.user?.email?.toLowerCase().includes(query)
        )
        .map(m => ({
          user: m.user,
          joined_at: m.joined_at,
          role: m.role,
          workspaces: [selectedWorkspace?.name || ""]
        }));
    }
  }, [selectedWorkspaceId, workspaces, allUniqueMembers, searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
              <Layers size={12} />
              Collaboration Hub
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            TEAM MEMBERS
          </h1>
          <p className="text-slate-400 text-sm">
            Manage roles and access permissions for members across your project workspaces.
          </p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={fetchWorkspaces}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition text-sm text-slate-600 cursor-pointer font-semibold shadow-sm"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          
          {selectedWorkspaceId !== "all" && (
            <div className="relative" ref={popoverRef}>
              <button 
                onClick={() => setIsInviteOpen(!isInviteOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-sm text-white font-medium cursor-pointer shadow-sm"
              >
                <UserPlus size={15} />
                Invite Member
              </button>
              
              {isInviteOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-30 p-4 text-slate-800">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">Invite to Workspace</h4>
                    <button 
                      onClick={() => setIsInviteOpen(false)} 
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <form onSubmit={handleInviteMember} className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="invite-email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Email Address <span className="text-blue-500">*</span>
                      </label>
                      <input
                        id="invite-email"
                        type="email"
                        placeholder="member@demo.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Role
                      </label>
                      <select 
                        value={inviteRole} 
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 transition text-xs font-bold py-2 rounded-lg text-white cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "Inviting..." : "Invite Member"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {loading && workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <RefreshCw className="animate-spin mb-4 text-blue-500" size={32} />
          <p className="text-sm">Loading workspaces...</p>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto mt-12 bg-white shadow-sm">
          <Layers size={40} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Projects Found</h3>
          <p className="text-sm text-slate-500">Create a project/workspace first before managing team members.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Workspace Selection & Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            {/* Selection Dropdown */}
            <div className="w-full md:w-80 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Project Workspace</label>
              <select
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer w-full transition"
              >
                <option value="all">All Workspaces</option>
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Members</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Filter by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Members List Container */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Member</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Workspaces</th>
                    <th className="py-4 px-6">Joined Date</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {displayedMembers.map((member: any) => {
                    const initials = member.user?.name ? member.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "US";
                    const isOwner = member.role === "owner";
                    const showActions = selectedWorkspaceId !== "all";

                    return (
                      <tr key={member.user?.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Member Profile */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 border border-slate-200 flex items-center justify-center font-bold text-blue-600 overflow-hidden shadow-sm flex-shrink-0">
                              {member.user?.avatar_url ? (
                                <img src={member.user.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                initials
                              )}
                            </div>
                            <span className="font-bold text-slate-800">{member.user?.name || "Unknown User"}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-6 text-slate-500 font-medium">
                          {member.user?.email}
                        </td>

                        {/* Associated Workspaces */}
                        <td className="py-4 px-6 max-w-[220px]">
                          <div className="flex flex-wrap gap-1.5">
                            {member.workspaces?.map((ws: string, idx: number) => (
                              <span key={idx} className="flex items-center gap-1 text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full max-w-[150px] truncate">
                                <Briefcase size={8} />
                                {ws}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-6 text-slate-400 font-medium">
                          {new Date(member.joined_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>

                        {/* Role Select */}
                        <td className="py-4 px-6">
                          {isOwner ? (
                            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 w-fit text-[10px] font-bold uppercase">
                              <Shield size={12} />
                              Owner
                            </div>
                          ) : showActions ? (
                            <div className="flex items-center gap-2">
                              {member.role === "admin" ? (
                                <Shield size={14} className="text-blue-500" />
                              ) : (
                                <User size={14} className="text-slate-400" />
                              )}
                              <select
                                value={member.role}
                                onChange={(e) => handleRoleChange(member.user.id, e.target.value as any)}
                                disabled={updatingUserId === member.user.id}
                                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition disabled:opacity-50 font-semibold"
                              >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 w-fit text-[10px] font-bold uppercase">
                              <User size={10} />
                              {member.role || "Member"}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-center">
                          {isOwner ? (
                            <span className="text-[10px] text-slate-400 font-bold uppercase">System Owner</span>
                          ) : showActions ? (
                            <button
                              onClick={() => handleRemoveMember(member.user.id, member.user?.name || "Member")}
                              disabled={removingUserId === member.user.id}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition cursor-pointer disabled:opacity-50"
                              title="Remove member from workspace"
                            >
                              <Trash2 size={16} className={removingUserId === member.user.id ? "animate-spin" : ""} />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold" title="Select a workspace to edit member">
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {displayedMembers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center text-slate-400 bg-slate-50/20 font-semibold">
                        No team members found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
