"use client";

import Link from "next/link";
import { LayoutGrid, ChevronRight, Home } from "lucide-react";

interface WorkspaceTopBarProps {
  workspaceName: string;
  workspaceId: string;
  boardCount?: number;
}

export default function WorkspaceTopBar({ workspaceName, workspaceId, boardCount }: WorkspaceTopBarProps) {
  return (
    <div className="silver-metallic border-b border-gray-300 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
      <div className="flex items-center gap-2">
        {/* Home / Dashboard link */}
        <Link 
          href="/dashboard/projects" 
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <Home size={15} />
          <span className="hidden sm:inline">Workspaces</span>
        </Link>
        <ChevronRight size={14} className="text-gray-450" />
        
        {/* Current workspace */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 silver-btn rounded flex items-center justify-center">
            <LayoutGrid size={12} className="text-gray-700" />
          </div>
          <h1 className="text-sm font-semibold text-gray-850">{workspaceName}</h1>
          {boardCount !== undefined && (
            <span className="text-[11px] px-2 py-0.5 bg-gray-200 rounded-full text-gray-650 font-medium border border-gray-300">
              {boardCount} board{boardCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
