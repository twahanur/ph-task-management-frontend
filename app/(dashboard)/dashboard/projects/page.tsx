import AddProject from "@/components/pages/shared/dashboard/all-projects/AddProject";
import { getAllWorkspaces } from "@/service/workspaceService/workspace.service";
import { Workspace } from "@/types/projectType/project.type";
import { LayoutGrid, Users, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  const workspacesRes = await getAllWorkspaces();
  const workspaces = workspacesRes?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 silver-metallic rounded-xl flex items-center justify-center">
            <LayoutGrid size={20} className="text-gray-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Peoject List</h1>
            <p className="text-sm text-gray-600">
              {workspaces.length} Project{workspaces.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <AddProject />
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((project: Workspace) => {
          const totalCards = project.summary?.cardsCount?.total || 0;
          const completedCards = project.summary?.cardsCount?.completed || 0;
          const progressPercent = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

          return (
            <Link 
              href={`/projects/${project.id}`} 
              key={project.id} 
              className="group silver-metallic rounded-xl transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Accent top bar */}
                <div className="h-1.5 silver-btn" />
                
                <div className="p-5 pb-3">
                  {/* Header row: Initial icon & Name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg silver-btn flex items-center justify-center text-gray-900 font-bold text-base shrink-0">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-gray-800 truncate group-hover:text-gray-900 transition-colors" title={project.name}>
                        {project.name}
                      </h3>
                      <p className="text-[11px] text-gray-600 font-medium flex items-center gap-1.5 mt-0.5">
                        <LayoutGrid size={11} className="text-gray-600" />
                        {project.summary?.activeBoardsCount !== undefined 
                          ? `${project.summary.activeBoardsCount} Active / ${project.summary.boardsCount} Total Board${project.summary.boardsCount !== 1 ? 's' : ''}`
                          : `${project._count?.boards || 0} Board${project._count?.boards !== 1 ? 's' : ''}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-gray-600 line-clamp-2 mb-4 min-h-[32px] leading-relaxed">
                    {project.description || "No description provided."}
                  </p>

                  {/* Summary / Progress Stats */}
                  {project.summary && (
                    <div className="space-y-4 pt-1 border-t border-gray-300/60">
                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                          <span>Task Progress</span>
                          <span className="text-gray-800 normal-case">
                            {completedCards}/{totalCards} ({progressPercent}%)
                          </span>
                        </div>
                        <div className="w-full silver-input rounded-full h-1.5 mt-1 overflow-hidden">
                          <div 
                            className="silver-btn h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Card state pills */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="silver-input rounded-lg py-1">
                          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">To Do</p>
                          <p className="text-xs font-bold text-gray-800 mt-0.5">{project.summary.cardsCount.todo}</p>
                        </div>
                        <div className="silver-input rounded-lg py-1">
                          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">Doing</p>
                          <p className="text-xs font-bold text-gray-800 mt-0.5">{project.summary.cardsCount.inProgress}</p>
                        </div>
                        <div className="silver-input rounded-lg py-1">
                          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">Done</p>
                          <p className="text-xs font-bold text-gray-800 mt-0.5">{project.summary.cardsCount.completed}</p>
                        </div>
                      </div>

                      {/* Alerts section */}
                      {(project.summary.highPriorityCardsCount > 0 || project.summary.overdueCardsCount > 0) && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {project.summary.highPriorityCardsCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded silver-btn text-gray-900">
                              <AlertCircle size={10} className="text-gray-700" />
                              {project.summary.highPriorityCardsCount} High Priority
                            </span>
                          )}
                          {project.summary.overdueCardsCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded silver-btn text-gray-900 animate-pulse">
                              <Clock size={10} className="text-gray-700" />
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
              <div className="p-5 pt-3 border-t border-gray-300/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {project.members?.slice(0, 4).map((member) => (
                      <div 
                        key={member.id} 
                        className="w-6 h-6 rounded-full silver-input flex items-center justify-center text-[10px] text-gray-700 font-bold uppercase overflow-hidden" 
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
                      <div className="w-6 h-6 rounded-full silver-input flex items-center justify-center text-[9px] text-gray-600 font-bold z-10">
                        +{(project.members?.length || 0) - 4}
                      </div>
                    )}
                  </div>
                  {(project.members?.length || 0) > 0 && (
                    <span className="text-[10px] text-gray-600 font-medium flex items-center gap-0.5">
                      <Users size={10} />
                      {project.members?.length} member{project.members?.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-0.5">
                  Open →
                </span>
              </div>
            </Link>
          );
        })}
        
        {(!workspaces || workspaces.length === 0) && (
          <div className="col-span-full flex flex-col items-center justify-center p-16 text-gray-600 border-2 border-dashed border-gray-300 rounded-xl silver-metallic">
            <LayoutGrid size={40} className="mb-3 text-gray-500" />
            <p className="text-lg font-medium text-gray-700 mb-1">No workspaces yet</p>
            <p className="text-sm">Create your first workspace to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
