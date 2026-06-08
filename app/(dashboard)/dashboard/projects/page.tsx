import AddProject from "@/components/pages/shared/dashboard/all-projects/AddProject";
import { getAllWorkspaces } from "@/service/workspaceService/workspace.service";
import { Workspace } from "@/types/projectType/project.type";
import { LayoutGrid, Star, Users, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  const workspacesRes = await getAllWorkspaces();
  const workspaces = workspacesRes?.data || [];

  // Color palette for workspace accent bars
  const accentColors = [
    "from-blue-500 to-blue-600",
    "from-violet-500 to-violet-600",
    "from-emerald-500 to-emerald-600",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-600",
    "from-indigo-500 to-indigo-600",
    "from-teal-500 to-teal-600",
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <LayoutGrid size={20} className="text-slate-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Peoject List</h1>
            <p className="text-sm text-slate-400">
              {workspaces.length} Project{workspaces.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <AddProject />
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((project: Workspace, index: number) => {
          const totalCards = project.summary?.cardsCount?.total || 0;
          const completedCards = project.summary?.cardsCount?.completed || 0;
          const progressPercent = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

          return (
            <Link 
              href={`/projects/${project.id}`} 
              key={project.id} 
              className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Accent top bar */}
                <div className={`h-1.5 bg-gradient-to-r ${accentColors[index % accentColors.length]}`} />
                
                <div className="p-5 pb-3">
                  {/* Header row: Initial icon & Name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${accentColors[index % accentColors.length]} flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0`}>
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-slate-800 truncate group-hover:text-blue-600 transition-colors" title={project.name}>
                        {project.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <LayoutGrid size={11} className="text-slate-400" />
                        {project.summary?.activeBoardsCount !== undefined 
                          ? `${project.summary.activeBoardsCount} Active / ${project.summary.boardsCount} Total Board${project.summary.boardsCount !== 1 ? 's' : ''}`
                          : `${project._count?.boards || 0} Board${project._count?.boards !== 1 ? 's' : ''}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 min-h-[32px] leading-relaxed">
                    {project.description || "No description provided."}
                  </p>

                  {/* Summary / Progress Stats */}
                  {project.summary && (
                    <div className="space-y-4 pt-1 border-t border-slate-50">
                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                          <span>Task Progress</span>
                          <span className="text-slate-700 normal-case">
                            {completedCards}/{totalCards} ({progressPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Card state pills */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-50/80 border border-slate-100 rounded-lg py-1">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">To Do</p>
                          <p className="text-xs font-bold text-slate-700 mt-0.5">{project.summary.cardsCount.todo}</p>
                        </div>
                        <div className="bg-amber-50/50 border border-amber-100/50 rounded-lg py-1">
                          <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Doing</p>
                          <p className="text-xs font-bold text-amber-700 mt-0.5">{project.summary.cardsCount.inProgress}</p>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-lg py-1">
                          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Done</p>
                          <p className="text-xs font-bold text-emerald-700 mt-0.5">{project.summary.cardsCount.completed}</p>
                        </div>
                      </div>

                      {/* Alerts section */}
                      {(project.summary.highPriorityCardsCount > 0 || project.summary.overdueCardsCount > 0) && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {project.summary.highPriorityCardsCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100">
                              <AlertCircle size={10} className="text-rose-500" />
                              {project.summary.highPriorityCardsCount} High Priority
                            </span>
                          )}
                          {project.summary.overdueCardsCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100 animate-pulse">
                              <Clock size={10} className="text-red-500" />
                              {project.summary.overdueCardsCount} Overdue
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer: Members list & Action button */}
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {project.members?.slice(0, 4).map((member) => (
                      <div 
                        key={member.id} 
                        className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase overflow-hidden shadow-sm" 
                        title={member.user?.name}
                      >
                        {member.user?.avatar_url ? (
                          <img src={member.user.avatar_url} alt={member.user.name} className="w-full h-full object-cover" />
                        ) : (
                          member.user?.name?.charAt(0) || 'U'
                        )}
                      </div>
                    ))}
                    {(project.members?.length || 0) > 4 && (
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] text-slate-500 font-bold z-10">
                        +{(project.members?.length || 0) - 4}
                      </div>
                    )}
                  </div>
                  {(project.members?.length || 0) > 0 && (
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                      <Users size={10} />
                      {project.members?.length} member{project.members?.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <span className="text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-0.5">
                  Open →
                </span>
              </div>
            </Link>
          );
        })}
        
        {(!workspaces || workspaces.length === 0) && (
          <div className="col-span-full flex flex-col items-center justify-center p-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white">
            <LayoutGrid size={40} className="mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-500 mb-1">No workspaces yet</p>
            <p className="text-sm">Create your first workspace to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
