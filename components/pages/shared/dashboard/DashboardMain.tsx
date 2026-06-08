/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { 
  FolderKanban, 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Calendar,
  Sparkles,
  TrendingUp,
  Activity,
  Shield,
  ChevronDown
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  AreaChart,
  Area
} from "recharts";
import Link from "next/link";
import { useUser } from "@/provider/AuthProvider";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ButtonComponent from "@/components/ui/ButtonComponent";
import { toast } from "sonner";
import { createWorkspace, getAllWorkspaces, addWorkspaceMember } from "@/service/workspaceService/workspace.service";
import { getBoardsByWorkspaceId, getBoardById } from "@/service/boardService/board.service";
import { createCard } from "@/service/listService/list.service";


interface DashboardMainProps {
  initialData: any;
}

export default function DashboardMain({ initialData }: DashboardMainProps) {
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Dialog visibility states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Data states for forms
  const [workspacesList, setWorkspacesList] = useState<any[]>([]);
  const [boardsListForm, setBoardsListForm] = useState<any[]>([]);
  const [listsListForm, setListsListForm] = useState<any[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);

  // Task Form Selection States
  const [taskWorkspaceId, setTaskWorkspaceId] = useState("");
  const [taskBoardId, setTaskBoardId] = useState("");
  const [taskListId, setTaskListId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Project Form States
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Member Form States
  const [memberWorkspaceId, setMemberWorkspaceId] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("member");
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Fetch workspaces when opening Task or Member modals
  const fetchWorkspacesForForms = async () => {
    setLoadingWorkspaces(true);
    try {
      const res = await getAllWorkspaces();
      if (res.success) {
        setWorkspacesList(res.data || []);
      } else {
        toast.error("Failed to load project workspaces");
      }
    } catch (error) {
      toast.error("Error loading project workspaces");
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  // Fetch boards when a workspace is selected in Task Form
  const fetchBoardsForTask = async (wsId: string) => {
    if (!wsId) {
      setBoardsListForm([]);
      setListsListForm([]);
      return;
    }
    setLoadingBoards(true);
    try {
      const res = await getBoardsByWorkspaceId(wsId);
      if (res.success) {
        setBoardsListForm(res.data || []);
      } else {
        toast.error("Failed to load boards");
      }
    } catch (error) {
      toast.error("Error loading boards");
    } finally {
      setLoadingBoards(false);
    }
  };

  // Fetch lists when a board is selected in Task Form
  const fetchListsForTask = async (bId: string) => {
    if (!bId) {
      setListsListForm([]);
      return;
    }
    setLoadingLists(true);
    try {
      const res = await getBoardById(bId);
      if (res.success && res.data) {
        setListsListForm(res.data.lists || []);
      } else {
        toast.error("Failed to load lists for this board");
      }
    } catch (error) {
      toast.error("Error loading lists");
    } finally {
      setLoadingLists(false);
    }
  };

  const openTaskModal = async () => {
    setIsTaskModalOpen(true);
    setTaskWorkspaceId("");
    setTaskBoardId("");
    setTaskListId("");
    setBoardsListForm([]);
    setListsListForm([]);
    await fetchWorkspacesForForms();
  };

  const openMemberModal = async () => {
    setIsMemberModalOpen(true);
    setMemberWorkspaceId("");
    setMemberEmail("");
    setMemberRole("member");
    await fetchWorkspacesForForms();
  };

  // Submit new project
  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    setIsCreatingProject(true);
    const toastId = toast.loading("Creating project, please wait...");
    try {
      const res = await createWorkspace({
        name: projectTitle,
        description: projectDescription
      });
      if (res?.success) {
        toast.success("Project created successfully", { id: toastId });
        setIsProjectModalOpen(false);
        setProjectTitle("");
        setProjectDescription("");
        // Redirect to new project's detail page
        if (res.data && res.data.id) {
          router.push(`/projects/${res.data.id}`);
        } else {
          router.push(`/dashboard/projects`);
        }
      } else {
        toast.error(res?.message || "Failed to create project", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to create project", { id: toastId });
    } finally {
      setIsCreatingProject(false);
    }
  };

  // Submit new task (card)
  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskWorkspaceId || !taskBoardId || !taskListId || !taskTitle.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsCreatingTask(true);
    const toastId = toast.loading("Creating task, please wait...");
    try {
      const res = await createCard(
        taskBoardId,
        taskListId,
        {
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          due_date: taskDueDate ? new Date(taskDueDate).toISOString() : null
        },
        taskWorkspaceId
      );
      if (res?.success) {
        toast.success("Task created successfully", { id: toastId });
        setIsTaskModalOpen(false);
        // Reset fields
        setTaskTitle("");
        setTaskDescription("");
        setTaskPriority("medium");
        setTaskDueDate("");
        // Redirect to project board details page
        router.push(`/projects/${taskWorkspaceId}/${taskBoardId}`);
      } else {
        toast.error(res?.message || "Failed to create task", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to create task", { id: toastId });
    } finally {
      setIsCreatingTask(false);
    }
  };

  // Submit member invite
  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberWorkspaceId || !memberEmail.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsAddingMember(true);
    const toastId = toast.loading("Adding member, please wait...");
    try {
      const res = await addWorkspaceMember(memberWorkspaceId, {
        email: memberEmail,
        role: memberRole
      });
      if (res?.success) {
        toast.success(res.message || "Member added successfully!", { id: toastId });
        setIsMemberModalOpen(false);
        setMemberEmail("");
        setMemberRole("member");
        // Redirect to team page
        router.push("/dashboard/team");
      } else {
        toast.error(res?.message || "Failed to add member", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred", { id: toastId });
    } finally {
      setIsAddingMember(false);
    }
  };

  // Dashboard API data
  const data = initialData?.data || {};
  const stats = data.stats || {};
  const boardsStats = stats.boards || { total: 0, active: 0, completed: 0 };
  const cardsStats = stats.cards || { total: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0, completionRate: 0 };

  const recentActivity = data.recentActivity || [];
  const recentComments = data.recentComments || [];
  const upcomingDeadlines = data.upcomingDeadlines || [];
  const highPriorityTasks = data.highPriorityTasks || [];
  const priorityBreakdown = data.priorityBreakdown || [];
  const statusDistribution = data.statusDistribution || [];
  const memberWorkload = data.memberWorkload || [];
  const teamProductivity = data.teamProductivity || [];
  const projectSummaries = data.projectSummaries || [];

  // Pagination states
  const [activityPage, setActivityPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);
  const [deadlinesPage, setDeadlinesPage] = useState(1);
  const [priorityTasksPage, setPriorityTasksPage] = useState(1);
  const [workloadPage, setWorkloadPage] = useState(1);

  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Formatting dates helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  // Pagination helpers
  const paginate = (array: any[], page: number, size = ITEMS_PER_PAGE) => {
    const start = (page - 1) * size;
    return array.slice(start, start + size);
  };

  const totalPages = (array: any[], size = ITEMS_PER_PAGE) => {
    return Math.max(1, Math.ceil(array.length / size));
  };

  // Donut Chart Data preparation
  const priorityChartData = priorityBreakdown.map((item: any) => ({
    name: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
    value: item.count
  }));

  const PRIORITY_COLORS = {
    High: "#f43f5e",   // rose-500
    Medium: "#f59e0b", // amber-500
    Low: "#3b82f6",    // blue-500
  };

  // Bar Chart Data preparation
  const barChartData = statusDistribution.map((item: any) => ({
    status: item.status.replace("_", " ").toUpperCase(),
    Count: item.count
  }));

  // Progress Gauge calculation (semi-circle pie chart)
  const topProject = projectSummaries.find((p: any) => p.status === "active") || projectSummaries[0];
  const progressPercent = topProject ? topProject.progress : 0;
  const gaugeData = [
    { value: progressPercent, color: "#10b981" }, // Green progress
    { value: 100 - progressPercent, color: "#e2e8f0" } // Gray remainder
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Greet and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 silver-metallic p-6 rounded-2xl border border-gray-300 shadow-sm transition-all duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="silver-input border-gray-300 text-gray-700 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shadow-sm">
              <Sparkles size={12} />
              Welcome Back
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-850 tracking-tight">
            WELCOME BACK, {(user as any)?.name || "Sarah"}! ({user?.role?.replace('_', ' ') || "Admin"})
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            Here is what is happening across your projects and workspaces today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl silver-btn cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            NEW PROJECT
          </button>
          <button 
            onClick={() => openTaskModal()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl silver-btn cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            NEW TASK
          </button>
          <button 
            onClick={() => openMemberModal()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl silver-btn cursor-pointer shadow-sm"
          >
            <Users size={16} />
            ADD MEMBER
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Stat 1: Total Projects */}
        <div className="silver-metallic rounded-2xl p-5 border border-gray-300 hover:border-gray-400 shadow-sm transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 silver-input rounded-xl flex items-center justify-center text-gray-800 transition-all duration-300">
              <FolderKanban size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-500">Projects</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-gray-850">{boardsStats.total}</h3>
            <p className="text-xs font-semibold text-gray-600 mt-1">TOTAL PROJECTS</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Active: {boardsStats.active}
            </span>
            <span>Completed: {boardsStats.completed}</span>
          </div>
        </div>

        {/* Stat 2: Total Tasks */}
        <div className="silver-metallic rounded-2xl p-5 border border-gray-300 hover:border-gray-400 shadow-sm transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 silver-input rounded-xl flex items-center justify-center text-gray-800 transition-all duration-300">
              <ListTodo size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-500">Tasks</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-gray-850">{cardsStats.total}</h3>
            <p className="text-xs font-semibold text-gray-600 mt-1">TOTAL TASKS</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300 text-[11px] text-gray-500">
            <span>Aggregated across all boards</span>
          </div>
        </div>

        {/* Stat 3: Tasks Completed */}
        <div className="silver-metallic rounded-2xl p-5 border border-gray-300 hover:border-gray-400 shadow-sm transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 silver-input rounded-xl flex items-center justify-center text-gray-850 transition-all duration-300">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-500">Done</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-gray-850">{cardsStats.completed}</h3>
            <p className="text-xs font-semibold text-gray-600 mt-1">TASKS COMPLETED</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300 flex items-center justify-between text-[11px] text-emerald-700 font-medium">
            <span className="flex items-center gap-1">
              <TrendingUp size={12} />
              {cardsStats.completionRate}% Rate
            </span>
          </div>
        </div>

        {/* Stat 4: Pending Tasks */}
        <div className="silver-metallic rounded-2xl p-5 border border-gray-300 hover:border-gray-400 shadow-sm transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 silver-input rounded-xl flex items-center justify-center text-gray-850 transition-all duration-300">
              <Clock size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-500">Pending</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-gray-850">
              {(cardsStats.pending || 0) + (cardsStats.inProgress || 0)}
            </h3>
            <p className="text-xs font-semibold text-gray-600 mt-1">PENDING TASKS</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300 flex items-center gap-3 text-[11px] text-gray-500">
            <span>Todo: {cardsStats.pending}</span>
            <span>Doing: {cardsStats.inProgress}</span>
          </div>
        </div>

        {/* Stat 5: Overdue Tasks */}
        <div className="silver-metallic rounded-2xl p-5 border border-gray-300 hover:border-gray-400 shadow-sm transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 silver-input rounded-xl flex items-center justify-center text-red-650 transition-all duration-300">
              <AlertCircle size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-500">Overdue</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-gray-855">{cardsStats.overdue}</h3>
            <p className="text-xs font-semibold text-gray-600 mt-1">OVERDUE TASKS</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300 flex items-center gap-1.5 text-[11px] text-red-700 font-semibold">
            {cardsStats.overdue > 0 ? (
              <>
                <AlertCircle size={12} className="animate-pulse" />
                Needs Attention
              </>
            ) : (
              "All up to date"
            )}
          </div>
        </div>
      </div>

      {/* Main 3-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Activity Log & Recent Comments */}
        <div className="space-y-6">
          {/* Card 1: Activity Log */}
          <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col justify-between h-[450px] p-5">
            <div className="flex items-center justify-between border-b border-gray-300 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-550" />
                <h3 className="font-bold text-gray-850 text-sm uppercase tracking-wide">Activity Log</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">
                  {activityPage}/{totalPages(recentActivity)}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActivityPage(prev => Math.max(1, prev - 1))}
                    disabled={activityPage === 1}
                    className="p-1 rounded silver-btn text-gray-800 disabled:opacity-50"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button 
                    onClick={() => setActivityPage(prev => Math.min(totalPages(recentActivity), prev + 1))}
                    disabled={activityPage === totalPages(recentActivity)}
                    className="p-1 rounded silver-btn text-gray-800 disabled:opacity-50"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-3 no-scrollbar space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">No recent activity</div>
              ) : (
                paginate(recentActivity, activityPage).map((activity: any) => (
                  <div key={activity.id} className="flex gap-3 text-xs">
                    <div className="relative flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full silver-input flex items-center justify-center border border-gray-300 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
                      </div>
                      <div className="w-px bg-gray-300 flex-1 my-1"></div>
                    </div>
                    <div className="space-y-1 pb-1">
                      <p className="text-gray-500 font-semibold text-[10px]">
                        {formatDate(activity.created_at)}
                      </p>
                      <p className="text-gray-800 leading-relaxed font-medium">
                        {activity.description}{" "}
                        <span className="text-gray-500 font-normal">
                          on board "{activity.board?.name}"
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-500">
                        by {activity.user?.name || "System"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 2: Recent Comments */}
          <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col justify-between h-[420px] p-5">
            <div className="flex items-center justify-between border-b border-gray-300 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-550" />
                <h3 className="font-bold text-gray-850 text-sm uppercase tracking-wide">Recent Comments</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">
                  {commentsPage}/{totalPages(recentComments)}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCommentsPage(prev => Math.max(1, prev - 1))}
                    disabled={commentsPage === 1}
                    className="p-1 rounded silver-btn text-gray-805 disabled:opacity-50"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button 
                    onClick={() => setCommentsPage(prev => Math.min(totalPages(recentComments), prev + 1))}
                    disabled={commentsPage === totalPages(recentComments)}
                    className="p-1 rounded silver-btn text-gray-805 disabled:opacity-50"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-3 no-scrollbar space-y-4">
              {recentComments.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">No recent comments</div>
              ) : (
                paginate(recentComments, commentsPage).map((comment: any) => {
                  const avatarUrl = comment.user?.avatar_url;
                  const nameInitials = comment.user?.name?.slice(0, 2).toUpperCase() || "US";
                  return (
                    <div key={comment.id} className="silver-input hover:bg-gray-200/50 p-3.5 rounded-xl border border-gray-300 space-y-2.5 transition">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 rounded-full border border-gray-300">
                            {avatarUrl ? (
                              <AvatarImage src={avatarUrl} />
                            ) : (
                              <span className="flex items-center justify-center font-bold text-[9px] uppercase w-full h-full bg-gray-250 text-gray-800 rounded-full">
                                {nameInitials}
                              </span>
                            )}
                          </Avatar>
                          <span className="font-semibold text-gray-805">{comment.user?.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 italic silver-metallic p-2.5 rounded-lg border border-gray-300 font-medium">
                        "{comment.content}"
                      </p>
                      <div className="text-[10px] text-gray-500 flex items-center justify-between">
                        <span>Card: <span className="font-semibold text-gray-800">{comment.card?.title}</span></span>
                        <span>Project: <span className="font-semibold text-gray-805">{comment.card?.board?.name}</span></span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Upcoming Deadlines & High Priority Tasks */}
        <div className="space-y-6">
          {/* Card 1: Upcoming Deadlines */}
          <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col justify-between h-[450px] p-5">
            <div className="flex items-center justify-between border-b border-gray-300 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-550" />
                <h3 className="font-bold text-gray-850 text-sm uppercase tracking-wide">Upcoming Deadlines</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">
                  {deadlinesPage}/{totalPages(upcomingDeadlines)}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setDeadlinesPage(prev => Math.max(1, prev - 1))}
                    disabled={deadlinesPage === 1}
                    className="p-1 rounded silver-btn text-gray-800 disabled:opacity-50"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button 
                    onClick={() => setDeadlinesPage(prev => Math.min(totalPages(upcomingDeadlines), prev + 1))}
                    disabled={deadlinesPage === totalPages(upcomingDeadlines)}
                    className="p-1 rounded silver-btn text-gray-800 disabled:opacity-50"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-3 no-scrollbar space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">No upcoming deadlines</div>
              ) : (
                paginate(upcomingDeadlines, deadlinesPage).map((task: any) => {
                  const projectSummary = projectSummaries.find((p: any) => p.id === task.board_id);
                  const progress = projectSummary ? projectSummary.progress : 0;
                  
                  return (
                    <div key={task.id} className="silver-input hover:bg-gray-200/50 p-4 rounded-xl border border-gray-300 space-y-3 transition">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-gray-850 text-xs truncate max-w-[170px]" title={task.title}>
                            {task.title}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                            <FolderKanban size={10} />
                            {task.board?.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded silver-metallic text-gray-800 border border-gray-350 shrink-0">
                          {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {task.description || "No description provided."}
                      </p>

                      {/* Progress bar */}
                      <div className="space-y-1.5 pt-1 border-t border-gray-300">
                        <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                          <span>Project Progress</span>
                          <span className="text-gray-750">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-1 overflow-hidden">
                          <div 
                            className="bg-gray-650 h-1 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card 2: High Priority Tasks */}
          <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col justify-between h-[420px] p-5">
            <div className="flex items-center justify-between border-b border-gray-300 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-gray-855 text-sm uppercase tracking-wide">High Priority Tasks</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">
                  {priorityTasksPage}/{totalPages(highPriorityTasks)}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setPriorityTasksPage(prev => Math.max(1, prev - 1))}
                    disabled={priorityTasksPage === 1}
                    className="p-1 rounded silver-btn text-gray-800 disabled:opacity-50"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button 
                    onClick={() => setPriorityTasksPage(prev => Math.min(totalPages(highPriorityTasks), prev + 1))}
                    disabled={priorityTasksPage === totalPages(highPriorityTasks)}
                    className="p-1 rounded silver-btn text-gray-805 disabled:opacity-50"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-3 no-scrollbar space-y-3">
              {highPriorityTasks.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">No high priority tasks</div>
              ) : (
                paginate(highPriorityTasks, priorityTasksPage).map((task: any) => (
                  <div key={task.id} className="border border-gray-300 hover:border-gray-400 rounded-xl p-3.5 flex flex-col justify-between gap-3 silver-input hover:shadow-sm transition duration-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-gray-850 text-xs truncate max-w-[200px]" title={task.title}>
                          {task.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium">
                          Project: {task.board?.name}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-150 rounded uppercase tracking-wider shrink-0">
                        High
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-300 bg-gray-250/20 px-2 py-1.5 rounded-lg">
                      <span className="text-[10px] text-gray-500">Assigns:</span>
                      <div className="flex -space-x-1.5">
                        {task.members?.slice(0, 3).map((m: any) => (
                          <div 
                            key={m.id} 
                            className="w-5.5 h-5.5 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-[9px] text-gray-700 font-bold uppercase overflow-hidden shadow-sm"
                            title={m.user?.name}
                          >
                            {m.user?.avatar_url ? (
                              <img src={m.user.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              m.user?.name?.charAt(0) || "U"
                            )}
                          </div>
                        ))}
                        {(task.members?.length || 0) > 3 && (
                          <div className="w-5.5 h-5.5 rounded-full silver-btn border border-gray-300 flex items-center justify-center text-[8px] text-gray-800 font-bold z-10 shadow-sm">
                            +{(task.members?.length || 0) - 3}
                          </div>
                        )}
                        {(task.members?.length || 0) === 0 && (
                          <span className="text-[9px] text-gray-500 font-medium">Unassigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Charts, Workload & Productivity */}
        <div className="space-y-6">
          {/* Chart 1: Tasks by Priority */}
          <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <h3 className="font-bold text-gray-850 text-xs uppercase tracking-wide">Tasks by Priority</h3>
              <span className="text-[10px] font-semibold text-gray-500">Priority Level Breakdown</span>
            </div>
            
            <div className="flex items-center justify-around">
              <div className="w-[120px] h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData.length > 0 ? priorityChartData : [{ name: "None", value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={55}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {priorityChartData.length > 0 ? (
                        priorityChartData.map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={(PRIORITY_COLORS as any)[entry.name] || "#6b7280"} 
                          />
                        ))
                      ) : (
                        <Cell fill="#e5e7eb" />
                      )}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ fontSize: "10px", borderRadius: "8px" }}
                      itemStyle={{ padding: "0px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-xs">
                {priorityChartData.map((entry: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: (PRIORITY_COLORS as any)[entry.name] || "#6b7280" }}
                    ></span>
                    <span className="text-gray-650 font-medium">{entry.name}:</span>
                    <span className="text-gray-850 font-bold">{entry.value}</span>
                  </div>
                ))}
                {priorityChartData.length === 0 && (
                  <span className="text-gray-500 text-xs">No priority tasks</span>
                )}
              </div>
            </div>
          </div>

          {/* Chart 2: Project Progress (Gauge) */}
          <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <h3 className="font-bold text-gray-855 text-xs uppercase tracking-wide">Project Progress</h3>
              <span className="text-[10px] font-semibold text-gray-500">Dial Metrics</span>
            </div>
            
            <div className="flex flex-col items-center justify-center relative pt-2">
              <div className="w-[180px] h-[100px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      <Cell fill={gaugeData[0].color} />
                      <Cell fill={gaugeData[1].color} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Absolute overlay for inner dial text */}
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-gray-850">{progressPercent}%</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Completed</span>
                </div>
              </div>
              <p className="text-gray-750 text-xs font-semibold mt-3 text-center truncate max-w-full">
                {topProject ? topProject.name : "No Active Project"}
              </p>
            </div>
          </div>

          {/* Chart 3: Task Status Distribution */}
          <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <h3 className="font-bold text-gray-855 text-xs uppercase tracking-wide">Task Status Distribution</h3>
              <span className="text-[10px] font-semibold text-gray-500">Stages Comparison</span>
            </div>
            
            <div className="w-full h-[150px]">
              {barChartData.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">No distribution data</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <XAxis dataKey="status" stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                    <Bar dataKey="Count" radius={[4, 4, 0, 0]}>
                      {barChartData.map((entry: any, index: number) => {
                        let barColor = "#6b7280"; // Default gray
                        if (entry.status === "COMPLETED") barColor = "#10b981"; // success
                        if (entry.status === "IN PROGRESS" || entry.status === "IN_PROGRESS") barColor = "#4b5563"; // neutral metal
                        if (entry.status === "TODO") barColor = "#f59e0b"; // warning
                        return <Cell key={`cell-${index}`} fill={barColor} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Card 4: Member Workload Summary */}
          <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm p-5 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-550" />
                  <h3 className="font-bold text-gray-850 text-xs uppercase tracking-wide">Member Workload Summary</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-gray-500 font-medium">
                    {workloadPage}/{totalPages(memberWorkload, 3)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button 
                      onClick={() => setWorkloadPage(prev => Math.max(1, prev - 1))}
                      disabled={workloadPage === 1}
                      className="p-0.5 rounded silver-btn text-gray-805 disabled:opacity-50"
                    >
                      <ChevronLeft size={10} />
                    </button>
                    <button 
                      onClick={() => setWorkloadPage(prev => Math.min(totalPages(memberWorkload, 3), prev + 1))}
                      disabled={workloadPage === totalPages(memberWorkload, 3)}
                      className="p-0.5 rounded silver-btn text-gray-805 disabled:opacity-50"
                    >
                      <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Members workload table */}
              <div className="mt-3 overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-gray-500 font-bold uppercase text-[9px] border-b border-gray-300 pb-2">
                      <th className="py-2">Member</th>
                      <th className="py-2 text-center">Total</th>
                      <th className="py-2 text-center">Done</th>
                      <th className="py-2 text-center">Pending</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-250 font-medium text-gray-750">
                    {memberWorkload.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500">No workload records</td>
                      </tr>
                    ) : (
                      paginate(memberWorkload, workloadPage, 3).map((member: any) => {
                        const initials = member.name?.slice(0, 2).toUpperCase() || "US";
                        return (
                          <tr key={member.id} className="hover:bg-gray-200/40 transition">
                            <td className="py-3.5 flex items-center gap-2.5">
                              <Avatar className="w-6.5 h-6.5 rounded-full border border-gray-300">
                                {member.avatar_url ? (
                                  <AvatarImage src={member.avatar_url} />
                                ) : (
                                  <span className="flex items-center justify-center font-bold text-[8px] uppercase w-full h-full bg-gray-250 text-gray-800 rounded-full">
                                    {initials}
                                  </span>
                                )}
                              </Avatar>
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-gray-850 truncate max-w-[85px]">{member.name}</span>
                                <span className="text-[9px] text-gray-500 capitalize">{member.role?.replace('_', ' ')}</span>
                              </div>
                            </td>
                            <td className="py-3.5 text-center font-bold text-gray-850">{member.cards?.total}</td>
                            <td className="py-3.5 text-center text-emerald-700 font-bold">{member.cards?.completed}</td>
                            <td className="py-3.5 text-center text-amber-600 font-bold">{member.cards?.pending}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Chart 5: Team Productivity */}
          <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <h3 className="font-bold text-gray-850 text-xs uppercase tracking-wide">Team Productivity</h3>
              <span className="text-[10px] font-semibold text-gray-500">Monthly Completed Tasks</span>
            </div>
            
            <div className="w-full h-[150px]">
              {teamProductivity.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">No productivity records</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={teamProductivity} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4b5563" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4b5563" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="period" stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                    <Area 
                      type="monotone" 
                      dataKey="completedTasks" 
                      stroke="#4b5563" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorProductivity)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* MODALS / DIALOGS SECTION */}
      {/* ========================================== */}

      {/* 1. New Project Dialog */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="max-w-[500px]! silver-metallic rounded-[24px]! p-8! border border-white/10!">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-[26px] font-semibold text-gray-800 tracking-tight">
              Create New Project
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm font-light">
              Add a new project to your workspace. Set the title and description below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProjectSubmit} className="flex flex-col gap-6 mt-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="p-title" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Project Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="p-title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. Website Redesign"
                required
                className="h-[56px]! rounded-[16px]!"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="p-description" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Description
              </label>
              <Textarea
                id="p-description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your project..."
                className="rounded-[16px]! min-h-[120px]"
              />
            </div>
            <DialogFooter className="mt-4 sm:justify-start">
              <button
                type="submit"
                disabled={isCreatingProject}
                className="w-full h-[56px] silver-btn font-semibold rounded-[16px] flex items-center justify-center gap-2"
              >
                {isCreatingProject ? "Creating..." : "Save Project"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. New Task Dialog */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="max-w-[500px]! silver-metallic rounded-[24px]! p-8! border border-white/10! overflow-y-auto max-h-[90vh]">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-[26px] font-semibold text-gray-800 tracking-tight">
              Create New Task
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm font-light">
              Add a new task card to a project list.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTaskSubmit} className="flex flex-col gap-6 mt-4">
            {/* Workspace selection */}
            <div className="flex flex-col gap-2">
              <label htmlFor="task-workspace" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Select Project <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="task-workspace"
                  value={taskWorkspaceId}
                  onChange={(e) => {
                    const wsId = e.target.value;
                    setTaskWorkspaceId(wsId);
                    setTaskBoardId("");
                    setTaskListId("");
                    fetchBoardsForTask(wsId);
                  }}
                  required
                  className="w-full h-[56px] silver-input rounded-[16px] px-4 pr-10 cursor-pointer appearance-none"
                >
                  <option value="" className="bg-gray-100 text-gray-800">-- Select Project --</option>
                  {workspacesList.map((w) => (
                    <option key={w.id} value={w.id} className="bg-gray-100 text-gray-800">{w.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Board selection */}
            <div className="flex flex-col gap-2">
              <label htmlFor="task-board" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Select Board <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="task-board"
                  value={taskBoardId}
                  onChange={(e) => {
                    const bId = e.target.value;
                    setTaskBoardId(bId);
                    setTaskListId("");
                    fetchListsForTask(bId);
                  }}
                  required
                  disabled={!taskWorkspaceId || loadingBoards}
                  className="w-full h-[56px] silver-input rounded-[16px] px-4 pr-10 cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value="" className="bg-gray-100 text-gray-800">
                    {loadingBoards ? "Loading boards..." : "-- Select Board --"}
                  </option>
                  {boardsListForm.map((b) => (
                    <option key={b.id} value={b.id} className="bg-gray-100 text-gray-800">{b.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* List selection */}
            <div className="flex flex-col gap-2">
              <label htmlFor="task-list" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Select List <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="task-list"
                  value={taskListId}
                  onChange={(e) => setTaskListId(e.target.value)}
                  required
                  disabled={!taskBoardId || loadingLists}
                  className="w-full h-[56px] silver-input rounded-[16px] px-4 pr-10 cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value="" className="bg-gray-100 text-gray-800">
                    {loadingLists ? "Loading lists..." : "-- Select List --"}
                  </option>
                  {listsListForm.map((l) => (
                    <option key={l.id} value={l.id} className="bg-gray-100 text-gray-800">{l.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Task Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="task-title" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Task Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Design Landing Page"
                required
                className="h-[56px]! rounded-[16px]!"
              />
            </div>

            {/* Task Description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="task-desc" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Description
              </label>
              <Textarea
                id="task-desc"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Task details..."
                className="rounded-[16px]! min-h-[80px]"
              />
            </div>

            {/* Priority & Due Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="task-priority" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="task-priority"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full h-[56px] silver-input rounded-[16px] px-4 pr-10 cursor-pointer appearance-none"
                  >
                    <option value="low" className="bg-gray-100 text-gray-800">Low</option>
                    <option value="medium" className="bg-gray-100 text-gray-800">Medium</option>
                    <option value="high" className="bg-gray-100 text-gray-800">High</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="task-duedate" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Due Date
                </label>
                <input
                  id="task-duedate"
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full h-[56px] silver-input rounded-[16px] px-4 cursor-pointer [color-scheme:light]"
                />
              </div>
            </div>

            <DialogFooter className="mt-4 sm:justify-start">
              <button
                type="submit"
                disabled={isCreatingTask}
                className="w-full h-[56px] silver-btn font-semibold rounded-[16px] flex items-center justify-center gap-2"
              >
                {isCreatingTask ? "Creating..." : "Save Task"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Add Member Dialog */}
      <Dialog open={isMemberModalOpen} onOpenChange={setIsMemberModalOpen}>
        <DialogContent className="max-w-[500px]! silver-metallic rounded-[24px]! p-8! border border-white/10!">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-[26px] font-semibold text-gray-800 tracking-tight">
              Invite Member
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm font-light">
              Add a new member to a project workspace.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMemberSubmit} className="flex flex-col gap-6 mt-4">
            {/* Workspace selection */}
            <div className="flex flex-col gap-2">
              <label htmlFor="member-workspace" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Select Project <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="member-workspace"
                  value={memberWorkspaceId}
                  onChange={(e) => setMemberWorkspaceId(e.target.value)}
                  required
                  className="w-full h-[56px] silver-input rounded-[16px] px-4 pr-10 cursor-pointer appearance-none"
                >
                  <option value="" className="bg-gray-100 text-gray-800">-- Select Project --</option>
                  {workspacesList.map((w) => (
                    <option key={w.id} value={w.id} className="bg-gray-100 text-gray-800">{w.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-2">
              <label htmlFor="member-email" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="member-email"
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="member@demo.com"
                required
                className="h-[56px]! rounded-[16px]!"
              />
            </div>

            {/* Role selection */}
            <div className="flex flex-col gap-2">
              <label htmlFor="member-role" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Role
              </label>
              <div className="relative">
                <select
                  id="member-role"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full h-[56px] silver-input rounded-[16px] px-4 pr-10 cursor-pointer appearance-none"
                >
                  <option value="member" className="bg-gray-100 text-gray-800">Member</option>
                  <option value="admin" className="bg-gray-100 text-gray-800">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 sm:justify-start">
              <button
                type="submit"
                disabled={isAddingMember}
                className="w-full h-[56px] silver-btn font-semibold rounded-[16px] flex items-center justify-center gap-2"
              >
                {isAddingMember ? "Inviting..." : "Invite Member"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
