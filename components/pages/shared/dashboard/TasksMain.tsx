"use client";

import React, { useState, useMemo } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  ListTodo,
  Calendar,
  MessageSquare,
  Paperclip,
  Layers
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TasksMainProps {
  initialData: any;
}

export default function TasksMain({ initialData }: TasksMainProps) {
  const stats = initialData?.data?.stats || {
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0,
    completionRate: 0,
  };
  
  const tasks = useMemo(() => initialData?.data?.tasks || [], [initialData]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedBoard, setSelectedBoard] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract list of unique boards for filter
  const boardsList = useMemo(() => {
    const boardMap = new Map<string, string>();
    tasks.forEach((t: any) => {
      if (t.board) {
        boardMap.set(t.board.id, t.board.name);
      }
    });
    return Array.from(boardMap.entries()).map(([id, name]) => ({ id, name }));
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task: any) => {
      const matchesSearch = 
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        selectedStatus === "all" || 
        task.status === selectedStatus;
      
      const matchesPriority = 
        selectedPriority === "all" || 
        task.priority === selectedPriority;
      
      const matchesBoard = 
        selectedBoard === "all" || 
        task.board_id === selectedBoard;

      return matchesSearch && matchesStatus && matchesPriority && matchesBoard;
    });
  }, [tasks, searchTerm, selectedStatus, selectedPriority, selectedBoard]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage));
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(start, start + itemsPerPage);
  }, [filteredTasks, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Greet */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="silver-btn text-gray-700 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
              <ListTodo size={12} />
              Task Center
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            MY TASKS
          </h1>
          <p className="text-slate-400 text-sm">
            View, filter, and track all tasks assigned to you across all project boards.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Tasks</span>
            <h3 className="text-3xl font-extrabold text-slate-800">{stats.total}</h3>
            <p className="text-xs text-slate-500">Assigned across all boards</p>
          </div>
          <div className="w-12 h-12 rounded-2xl silver-btn flex items-center justify-center text-gray-700 shrink-0">
            <Layers size={24} />
          </div>
        </div>

        {/* Metric 2: Completed Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Completed</span>
            <h3 className="text-3xl font-extrabold text-gray-700">{stats.completed}</h3>
            <p className="text-xs text-slate-500">
              {stats.completionRate}% completion rate
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl silver-btn flex items-center justify-center text-gray-700 shrink-0">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Metric 3: Pending & In Progress */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Tasks</span>
            <h3 className="text-3xl font-extrabold text-gray-700">
              {stats.inProgress + stats.todo}
            </h3>
            <p className="text-xs text-slate-500">
              {stats.inProgress} in progress · {stats.todo} todo
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl silver-btn flex items-center justify-center text-gray-700 shrink-0">
            <Clock size={24} />
          </div>
        </div>

        {/* Metric 4: Overdue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Overdue Tasks</span>
            <h3 className={`text-3xl font-extrabold ${stats.overdue > 0 ? "text-gray-700" : "text-slate-800"}`}>
              {stats.overdue}
            </h3>
            <p className="text-xs text-slate-500">
              {stats.overdue > 0 ? "Action required immediately" : "All deadlines on track"}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stats.overdue > 0 ? "silver-btn text-gray-700" : "bg-slate-50 text-slate-400"}`}>
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      {/* Task Listing & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col p-6 space-y-6">
        {/* Filters Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search tasks by title or description..."
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
            {/* Filter Status */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
              <Filter size={12} className="text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Filter Priority */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
              <Filter size={12} className="text-slate-400" />
              <select
                value={selectedPriority}
                onChange={(e) => {
                  setSelectedPriority(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium focus:outline-none cursor-pointer text-slate-600"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Filter Board */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
              <Filter size={12} className="text-slate-400" />
              <select
                value={selectedBoard}
                onChange={(e) => {
                  setSelectedBoard(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium focus:outline-none cursor-pointer text-slate-600"
              >
                <option value="all">All Boards</option>
                {boardsList.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            {(searchTerm || selectedStatus !== "all" || selectedPriority !== "all" || selectedBoard !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                  setSelectedPriority("all");
                  setSelectedBoard("all");
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

        {/* Table View */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100 pb-2.5">
                <th className="py-3 px-3">Task Title</th>
                <th className="py-3 px-3">Board & List</th>
                <th className="py-3 px-3 text-center">Priority</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Assigned Members</th>
                <th className="py-3 px-3 text-right">Metrics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-450">
                    <AlertCircle size={24} className="mx-auto text-slate-300 mb-2 animate-bounce" />
                    No task records found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginatedTasks.map((task: any) => {
                  const now = new Date();
                  const isOverdue = task.due_date && new Date(task.due_date) < now && task.status !== "completed";
                  const formattedDueDate = task.due_date ? new Date(task.due_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }) : "No due date";

                  // Priority styles
                  let priorityBadge = "";
                  if (task.priority === "high") {
                    priorityBadge = "text-gray-700 silver-btn border-gray-300";
                  } else if (task.priority === "medium") {
                    priorityBadge = "text-gray-700 silver-btn border-gray-300";
                  } else {
                    priorityBadge = "text-slate-600 bg-slate-50 border-slate-200";
                  }

                  // Status styles
                  let statusBadge = "";
                  if (task.status === "completed") {
                    statusBadge = "text-gray-700 silver-btn border-gray-300";
                  } else if (task.status === "in_progress") {
                    statusBadge = "text-gray-700 silver-btn border-gray-300";
                  } else {
                    statusBadge = "text-slate-600 bg-slate-50 border-slate-200";
                  }

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/50 transition">
                      {/* Title & Description */}
                      <td className="py-4 px-3 max-w-[200px]">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-800 text-sm truncate">{task.title}</span>
                          {task.description && (
                            <span className="text-[11px] text-slate-400 truncate">{task.description}</span>
                          )}
                        </div>
                      </td>

                      {/* Board & List details */}
                      <td className="py-4 px-3 text-slate-500 font-medium">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-700 text-xs">{task.board?.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{task.list?.name}</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-wide ${priorityBadge}`}>
                          {task.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 border rounded-full capitalize ${statusBadge}`}>
                          {task.status?.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-3 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className={isOverdue ? "text-gray-700" : "text-slate-400"} />
                          <span className={isOverdue ? "text-gray-700 font-bold" : "text-slate-500"}>
                            {formattedDueDate}
                            {isOverdue && <span className="text-[9px] uppercase ml-1.5 font-extrabold px-1.5 py-0.5 silver-btn border border-gray-300 rounded text-gray-700">Overdue</span>}
                          </span>
                        </div>
                      </td>

                      {/* Assigned Members */}
                      <td className="py-4 px-3">
                        <div className="flex items-center -space-x-1.5 overflow-hidden">
                          {task.members?.slice(0, 3).map((m: any) => {
                            const name = m.user?.name || "User";
                            const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                            return (
                              <Avatar key={m.id} className="w-7 h-7 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200">
                                <AvatarImage src={m.user?.avatar_url} />
                                <AvatarFallback className="text-[10px] font-bold silver-btn text-gray-700">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                          {task.members?.length > 3 && (
                            <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500 ring-1 ring-slate-200 shrink-0">
                              +{task.members.length - 3}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Comments & Attachments */}
                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end gap-3 text-slate-400 font-bold">
                          <span className="flex items-center gap-1 text-[11px]" title="Comments count">
                            <MessageSquare size={13} />
                            {task._count?.comments || 0}
                          </span>
                          <span className="flex items-center gap-1 text-[11px]" title="Attachments count">
                            <Paperclip size={13} />
                            {task._count?.attachments || 0}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredTasks.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">
              Showing <span className="font-semibold text-slate-600">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-600">{Math.min(currentPage * itemsPerPage, filteredTasks.length)}</span> of <span className="font-semibold text-slate-600">{filteredTasks.length}</span> tasks
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
