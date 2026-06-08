import { getWorkspaceById } from "@/service/workspaceService/workspace.service";
import CreateBoard from "@/components/pages/shared/boards/CreateBoard";
import BoardsList from "@/components/pages/shared/boards/BoardsList";
import WorkspaceTopBar from "@/components/pages/shared/boards/components/WorkspaceTopBar";

export default async function page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params
    const workspace = await getWorkspaceById(id)
    const boards = workspace?.data?.boards || [];

    return (
        <div className="min-h-screen">
            {/* Top navigation bar */}
            <WorkspaceTopBar 
                workspaceName={workspace?.data?.name || "Workspace"} 
                workspaceId={id}
                boardCount={boards.length}
            />

            {/* Content area */}
            <div className="max-w-6xl mx-auto px-6 py-6">
                {/* Description + create button row */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-1">
                            {workspace?.data?.name || "Workspace"}
                        </h2>
                        <p className="text-sm text-slate-400">
                            {workspace?.data?.description || "Manage your boards here."}
                        </p>
                    </div>
                    <CreateBoard workspaceId={id} />
                </div>

                {/* Boards grid */}
                <BoardsList boards={boards} workspaceId={id} />
            </div>
        </div>
    )
}