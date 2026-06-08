/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { 
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  BarChart4
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend
} from "recharts";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface WorkloadMainProps {
  initialData: any;
}

export default function WorkloadMain({ initialData }: WorkloadMainProps) {
  const members = useMemo(() => initialData?.data || [], [initialData]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((member: any) => {
      const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = 
        selectedRole === "all" || 
        member.role?.toLowerCase() === selectedRole.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [members, searchTerm, selectedRole]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage));
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  // Calculations
  const stats = useMemo(() => {
    let totalMembers = members.length;
    let totalAssignedCards = 0;
    let totalCompleted = 0;
    let totalPending = 0;
    let maxWorkloadUser = { name: "N/A", count: 0 };

    members.forEach((m: any) => {
      const cards = m.cards || { total: 0, completed: 0, pending: 0 };
      totalAssignedCards += cards.total;
      totalCompleted += cards.completed;
      totalPending += cards.pending;

      if (cards.total > maxWorkloadUser.count) {
        maxWorkloadUser = { name: m.name, count: cards.total };
      }
    });

    const completionRate = totalAssignedCards > 0 
      ? Math.round((totalCompleted / totalAssignedCards) * 100) 
      : 0;

    return {
      totalMembers,
      totalAssignedCards,
      totalCompleted,
      totalPending,
      completionRate,
      maxWorkloadUser
    };
  }, [members]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return members.map((m: any) => ({
      name: m.name,
      Completed: m.cards?.completed || 0,
      Pending: m.cards?.pending || 0
    }));
  }, [members]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Greet and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 silver-metallic p-6 rounded-2xl border border-gray-300 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="silver-input border-gray-300 text-gray-700 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
              <BarChart4 size={12} />
              Team Optimization
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-850 tracking-tight">
            TEAM WORKLOAD SUMMARY
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            Analyze resource allocation, card workloads, and completion rates per team member.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Team Members */}
        <div className="silver-metallic rounded-2xl p-5 border border-gray-300 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500">Total Members</span>
            <h3 className="text-3xl font-extrabold text-gray-850">{stats.totalMembers}</h3>
            <p className="text-xs text-gray-600">Active team contributors</p>
          </div>
          <div className="w-12 h-12 rounded-2xl silver-input flex items-center justify-center text-gray-800 shrink-0">
            <Users size={24} />
          </div>
        </div>

        {/* Metric 2: Assigned Tasks */}
        <div className="silver-metallic rounded-2xl p-5 border border-gray-300 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500">Assigned Tasks</span>
            <h3 className="text-3xl font-extrabold text-gray-855">{stats.totalAssignedCards}</h3>
            <p className="text-xs text-gray-600">
              {stats.totalCompleted} completed · {stats.totalPending} pending
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl silver-input flex items-center justify-center text-gray-800 shrink-0">
            <Clock size={24} />
          </div>
        </div>

        {/* Metric 3: Team Completion Rate */}
        <div className="silver-metallic rounded-2xl p-5 border border-gray-300 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500">Avg Completion Rate</span>
            <h3 className="text-3xl font-extrabold text-emerald-700">{stats.completionRate}%</h3>
            <p className="text-xs text-gray-600 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp size={12} />
              Across all assigned tasks
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl silver-input flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Metric 4: Busy Contributor */}
        <div className="silver-metallic rounded-2xl p-5 border border-gray-300 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500">Highest Workload</span>
            <h3 className="text-lg font-bold text-gray-850 truncate max-w-[155px]">
              {stats.maxWorkloadUser.name}
            </h3>
            <p className="text-xs text-gray-600">
              Assigned {stats.maxWorkloadUser.count} total tasks
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl silver-input flex items-center justify-center text-gray-850 shrink-0">
            <UserCheck size={24} />
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart Card */}
      {chartData.length > 0 && (
        <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm p-6 space-y-4">
          <div className="border-b border-gray-300 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-gray-850 text-sm uppercase tracking-wide">Workload Breakdown per Member</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Tasks Distribution</span>
          </div>

          <div className="w-full h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px", border: "1px solid #d1d5db" }} />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="Completed" stackId="a" fill="#9ca3af" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Pending" stackId="a" fill="#4b5563" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Members Workload List / Table */}
      <div className="silver-metallic rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex flex-col p-6 space-y-6">
        
        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-300">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Search team member by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm silver-input border border-gray-305 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400/20 transition"
            />
          </div>

          {/* Select Options */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Role */}
            <div className="flex items-center gap-1.5 silver-input border border-gray-305 px-3 py-1.5 rounded-xl text-xs text-gray-750">
              <Filter size={12} className="text-gray-500" />
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-gray-150 text-gray-800">All Roles</option>
                <option value="admin" className="bg-gray-150 text-gray-800">Admins</option>
                <option value="project_manager" className="bg-gray-150 text-gray-800">Project Managers</option>
                <option value="team_member" className="bg-gray-150 text-gray-800">Team Members</option>
              </select>
            </div>

            {/* Reset Button */}
            {(searchTerm || selectedRole !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("all");
                  setCurrentPage(1);
                }}
                className="flex items-center gap-1 text-xs text-gray-800 hover:text-gray-900 font-semibold px-2.5 py-1.5 rounded-xl silver-btn cursor-pointer"
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
              <tr className="text-gray-500 font-bold uppercase text-[10px] border-b border-gray-300 pb-2.5">
                <th className="py-3 px-3">Team Member</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3 text-center">Total Tasks</th>
                <th className="py-3 px-3 text-center text-emerald-700">Completed</th>
                <th className="py-3 px-3 text-center text-amber-605">Pending</th>
                <th className="py-3 px-3">Completion Bar</th>
                <th className="py-3 px-3 text-right">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-250 font-medium text-gray-750">
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    <AlertCircle size={24} className="mx-auto text-gray-500 mb-2 animate-bounce" />
                    No member records found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member: any) => {
                  const initials = member.name?.slice(0, 2).toUpperCase() || "US";
                  const total = member.cards?.total || 0;
                  const completed = member.cards?.completed || 0;
                  const pending = member.cards?.pending || 0;
                  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <tr key={member.id} className="hover:bg-gray-200/40 transition">
                      {/* Name and Avatar */}
                      <td className="py-4 px-3 flex items-center gap-3">
                        <Avatar className="w-8.5 h-8.5 rounded-full border border-gray-300 shadow-sm">
                          {member.avatar_url ? (
                            <AvatarImage src={member.avatar_url} />
                          ) : (
                            <span className="flex items-center justify-center font-bold text-xs uppercase w-full h-full bg-gray-250 text-gray-800 rounded-full">
                              {initials}
                            </span>
                          )}
                        </Avatar>
                        <span className="font-bold text-gray-850 text-sm truncate max-w-[130px]">{member.name}</span>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-3">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 silver-input text-gray-750 border border-gray-300 rounded-full capitalize">
                          {member.role?.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-3 text-center font-bold text-gray-850">{total}</td>

                      {/* Completed */}
                      <td className="py-4 px-3 text-center text-emerald-700 font-bold">{completed}</td>

                      {/* Pending */}
                      <td className="py-4 px-3 text-center text-amber-605 font-bold">{pending}</td>

                      {/* Completion Progress Bar */}
                      <td className="py-4 px-3 min-w-[120px]">
                        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden border border-gray-350">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              rate >= 75 ? "bg-emerald-600" : rate >= 40 ? "bg-gray-600" : "bg-amber-600"
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </td>

                      {/* Rate */}
                      <td className="py-4 px-3 text-right font-extrabold text-gray-850">{rate}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredMembers.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-300 text-xs">
            <span className="text-gray-550 font-medium">
              Showing <span className="font-semibold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredMembers.length)}</span> of <span className="font-semibold text-gray-800">{filteredMembers.length}</span> members
            </span>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl silver-btn text-gray-800 disabled:opacity-50 font-semibold"
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
                          ? "silver-btn border-gray-450 text-gray-950 font-extrabold shadow-sm" 
                          : "silver-btn text-gray-805"
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl silver-btn text-gray-800 disabled:opacity-50 font-semibold"
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
