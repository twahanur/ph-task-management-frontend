export type TCreateProjectPayload =
    {
        name: string,
        description: string
    }

// export type TUpdateProjectPayload =
//     {
//         name: string,
//         description: string
//     }



export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'project_manager' | 'team_member';
  joined_at: string;
  user: WorkspaceUser;
}


interface WorkspaceCount {
  boards: number;
}

export interface WorkspaceSummary {
  membersCount: number;
  boardsCount: number;
  activeBoardsCount: number;
  completedBoardsCount: number;
  cardsCount: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  };
  highPriorityCardsCount: number;
  overdueCardsCount: number;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  members: WorkspaceMember[];
  _count: WorkspaceCount;
  summary?: WorkspaceSummary;
}