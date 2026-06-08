/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { 
  Activity,
  Search,
  Filter,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Edit,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  User,
  Layout,
  RefreshCw
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ActivityLogMainProps {
  initialData: any;
}

export default function ActivityLogMain({ initialData }: ActivityLogMainProps) {
  const activities = useMemo(() => initialData?.data || [], [initialData]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActionType, setSelectedActionType] = useState("all");
  const [selectedEntityType, setSelectedEntityType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((activity: any) => {
      const matchesSearch = 
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.board?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = 
        selectedActionType === "all" || 
        activity.action_type?.toLowerCase() === selectedActionType.toLowerCase();

      const matchesEntity = 
        selectedEntityType === "all" || 
        activity.entity_type?.toLowerCase() === selectedEntityType.toLowerCase();

      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [activities, searchTerm, selectedActionType, selectedEntityType]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage));
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(start, start + itemsPerPage);
  }, [filteredActivities, currentPage, itemsPerPage]);

  // Metrics calculations
  const metrics = useMemo(() => {
    const total = activities.length;
    const completed = activities.filter((a: any) => a.action_type === "completed").length;
    const deleted = activities.filter((a: any) => a.action_type === "deleted").length;
    const created = activities.filter((a: any) => a.action_type === "created").length;
    const updated = activities.filter((a: any) => a.action_type === "updated").length;

    // Top active contributor
    const userCounts: Record<string, { name: string; count: number; avatar: string | null }> = {};
    activities.forEach((a: any) => {
      if (a.user) {
        const uId = a.user.id;
        if (!userCounts[uId]) {
          userCounts[uId] = { name: a.user.name, count: 0, avatar: a.user.avatar_url };
        }
        userCounts[uId].count += 1;
      }
    });

    let topUser = { name: "No Data", count: 0, avatar: null as string | null };
    Object.values(userCounts).forEach((u) => {
      if (u.count > topUser.count) {
        topUser = u;
      }
    });

    return { total, completed, deleted, created, updated, topUser };
  }, [activities]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  // Helper to get action icon and color classes
  const getActionStyles = (actionType: string) => {
    const action = actionType?.toLowerCase();
    switch (action) {
      case "created":
        return {
          icon: <PlusCircle size={14} />,
          bg: "silver-btn text-gray-700 border-gray-300",
          iconBg: "silver-btn text-white",
          dotColor: "silver-btn"
        };
      case "completed":
        return {
          icon: <CheckCircle2 size={14} />,
          bg: "silver-btn text-gray-700 border-gray-300",
          iconBg: "silver-btn text-white",
          dotColor: "silver-btn"
        };
      case "deleted":
        return {
          icon: <Trash2 size={14} />,
          bg: "silver-btn text-gray-700 border-gray-300",
          iconBg: "silver-btn text-white",
          dotColor: "silver-btn"
        };
      case "updated":
        default:
        return {
          icon: <Edit size={14} />,
          bg: "silver-btn text-gray-700 border-gray-300",
          iconBg: "silver-btn text-white",
          dotColor: "silver-btn"
        };
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Greet and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="silver-btn text-gray-700 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
              <Activity size={12} className="animate-pulse" />
              Audit Log
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            RECENT ACTIVITY LOG
          </h1>
          <p className="text-slate-400 text-sm">
            Monitor and track changes made across your workspaces, projects, boards, and checklist items.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Activities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Activities</span>
            <h3 className="text-3xl font-extrabold text-slate-800">{metrics.total}</h3>
            <p className="text-xs text-slate-500">Workspace updates logged</p>
          </div>
          <div className="w-12 h-12 rounded-2xl silver-btn flex items-center justify-center text-gray-700 shrink-0">
            <Activity size={24} />
          </div>
        </div>

        {/* Metric 2: Completion Logged */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Items Completed</span>
            <h3 className="text-3xl font-extrabold text-gray-700">{metrics.completed}</h3>
            <p className="text-xs text-slate-500">Checklist milestones reached</p>
          </div>
          <div className="w-12 h-12 rounded-2xl silver-btn flex items-center justify-center text-gray-700 shrink-0">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Metric 3: Creations & Updates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Created / Updated</span>
            <h3 className="text-3xl font-extrabold text-slate-800">
              {metrics.created + metrics.updated}
            </h3>
            <p className="text-xs text-slate-500">
              {metrics.created} created · {metrics.updated} modified
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl silver-btn flex items-center justify-center text-gray-700 shrink-0">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Metric 4: Top Contributor */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Top Contributor</span>
            <h3 className="text-lg font-bold text-slate-800 truncate max-w-[150px]">
              {metrics.topUser.name}
            </h3>
            <p className="text-xs text-slate-500">
              Logged {metrics.topUser.count} activities
            </p>
          </div>
          <Avatar className="w-12 h-12 rounded-2xl border border-slate-100 flex-shrink-0">
            {metrics.topUser.avatar ? (
              <AvatarImage src={metrics.topUser.avatar} />
            ) : (
              <span className="flex items-center justify-center font-bold text-sm uppercase w-full h-full bg-slate-200 text-slate-600 rounded-2xl">
                {metrics.topUser.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </Avatar>
        </div>
      </div>

      {/* Main Container: Filter Toolbar & Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-6 space-y-6">
        
        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search by action description, user, or board..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition"
            />
          </div>

          {/* Select Options */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Action Type */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
              <Filter size={12} className="text-slate-400" />
              <select
                value={selectedActionType}
                onChange={(e) => {
                  setSelectedActionType(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="all">All Actions</option>
                <option value="created">Created</option>
                <option value="updated">Updated</option>
                <option value="completed">Completed</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            {/* Filter Entity Type */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
              <Layout size={12} className="text-slate-400" />
              <select
                value={selectedEntityType}
                onChange={(e) => {
                  setSelectedEntityType(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="all">All Entities</option>
                <option value="board">Boards</option>
                <option value="checklist">Checklists</option>
                <option value="card">Cards</option>
                <option value="customfield">Custom Fields</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(searchTerm || selectedActionType !== "all" || selectedEntityType !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedActionType("all");
                  setSelectedEntityType("all");
                  setCurrentPage(1);
                }}
                className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-700 font-semibold px-2 py-1.5 rounded-xl hover:silver-btn transition cursor-pointer"
              >
                <RefreshCw size={11} />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Timeline List */}
        <div className="relative border-l border-slate-200 pl-6 ml-4 space-y-8 py-2 min-h-[300px]">
          {paginatedActivities.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 -ml-4">
              <Activity size={32} className="text-slate-300 mb-2 animate-bounce" />
              <p className="text-sm font-semibold text-slate-500">No activity matches the current filters</p>
              <p className="text-xs text-slate-400">Try broadening your search criteria.</p>
            </div>
          ) : (
            paginatedActivities.map((activity: any) => {
              const styles = getActionStyles(activity.action_type);
              const initials = activity.user?.name?.slice(0, 2).toUpperCase() || "US";

              return (
                <div key={activity.id} className="relative flex items-start gap-4 animate-in fade-in slide-in-from-left-2 duration-200">
                  {/* Timeline bullet icon */}
                  <span className={`absolute -left-[35px] top-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-sm font-bold ${styles.iconBg}`}>
                    {styles.icon}
                  </span>

                  {/* Activity Details Card */}
                  <div className="flex-1 bg-slate-50/50 hover:bg-slate-50 p-4 rounded-2xl border border-slate-150 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Log details */}
                    <div className="flex items-start gap-3.5">
                      {/* User Avatar */}
                      <Avatar className="w-10 h-10 rounded-xl border border-slate-200 shadow-sm shrink-0">
                        {activity.user?.avatar_url ? (
                          <AvatarImage src={activity.user.avatar_url} />
                        ) : (
                          <span className="flex items-center justify-center font-bold text-xs uppercase w-full h-full bg-slate-200 text-slate-600 rounded-xl">
                            {initials}
                          </span>
                        )}
                      </Avatar>

                      {/* Log text content */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">{activity.user?.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles.bg} capitalize`}>
                            {activity.action_type}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                            {activity.entity_type}
                          </span>
                        </div>
                        <p className="text-slate-700 text-xs leading-relaxed font-semibold">
                          {activity.description}
                        </p>
                        {activity.board && (
                          <p className="text-[10px] text-slate-400 font-medium">
                            Project Board: <span className="font-semibold text-slate-500">"{activity.board.name}"</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 shrink-0 md:text-right mt-1 md:mt-0">
                      <Clock size={12} className="text-slate-300" />
                      <span>{formatDate(activity.created_at)}</span>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {filteredActivities.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">
              Showing <span className="font-semibold text-slate-600">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-600">{Math.min(currentPage * itemsPerPage, filteredActivities.length)}</span> of <span className="font-semibold text-slate-600">{filteredActivities.length}</span> activities
            </span>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  // Show current page, first, last, and pages around current
                  if (totalPages > 5 && pNum !== 1 && pNum !== totalPages && Math.abs(currentPage - pNum) > 1) {
                    if (pNum === 2 || pNum === totalPages - 1) {
                      return <span key={pNum} className="px-1 text-slate-400">...</span>;
                    }
                    return null;
                  }
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center font-bold transition cursor-pointer ${
                        currentPage === pNum 
                          ? "silver-btn text-white shadow-sm shadow-gray-300" 
                          : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
