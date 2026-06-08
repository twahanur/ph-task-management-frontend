/* eslint-disable @typescript-eslint/no-explicit-any */
export type TCreateBoardPayload = {
    name: string,
    description: string,
    background_color: string,
    visibility: string
}

interface BoardCreator {
    id: string;
    name: string;
    avatar_url: string | null;
}

interface BoardCount {
    cards: number;
}

export interface TBoard {
    id: string;
    workspace_id: string;
    name: string;
    description: string;
    cover_image_url: string | null;
    background_color: string;
    visibility: 'workspace' | 'private' | 'public' | string;
    status: 'active' | 'archived' | string;
    created_by: string;
    created_at: string;
    updated_at: string;
    creator: BoardCreator;
    _count: BoardCount;
    isStarred: boolean;
}


interface BoardCreator {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface TBoardMemberUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

interface BoardMember {
  id: string;
  board_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  user: TBoardMemberUser;
}


export interface TBoardMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  user: TBoardMemberUser;
}

interface Card {
  id: string;
  list_id: string;
  board_id: string;
  title: string;
  description: string;
  due_date: string | null;
  due_reminder: number | null;
  priority: 'low' | 'medium' | 'high' | string;
  status: string;
  position: number;
  is_archived: boolean;
  cover_color: string | null;
  cover_image_url: string | null;
  completed_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  members: any[];
  labels: any[];
  custom_values: any[];
  isWatching: boolean;
  commentsCount: number;
  checklistsCount: number;
  attachmentsCount: number;
}

interface BoardList {
  id: string;
  board_id: string;
  name: string;
  position: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  cards: Card[];
}

export interface TBoardDetails {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  cover_image_url: string | null;
  background_color: string;
  visibility: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator: BoardCreator;
  custom_fields: any[];
  members: BoardMember[];
  lists: BoardList[];
  labels: any[];
  isStarred: boolean;
}

