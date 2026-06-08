import { TCreateBoardPayload } from "@/types/baordType/board.type";
import { createData, readData, patchData } from "../apiService/crud";

export async function createBoard(workspaceId: string,data: TCreateBoardPayload) {
    return createData(`/boards/workspaces/${workspaceId}/boards`, `/projects/${workspaceId}`,data)
}

export async function getBoardsByWorkspaceId(workspaceId: string) {
    return readData(`/boards/workspaces/${workspaceId}/boards`, [""])
}

export async function getBoardById(boardId:string) {
    return readData(`/boards/${boardId}`, [""])
}

export async function toggleStarBoard(boardId: string, workspaceId: string) {
    return createData(`/boards/${boardId}/star`, `/projects/${workspaceId}`, {})
}

export async function copyBoard(boardId: string, workspaceId: string) {
    return createData(`/boards/${boardId}/copy`, `/projects/${workspaceId}`, {})
}

export async function addBoardMember(boardId: string, workspaceId: string, data: { email: string; role: string }) {
    return createData(`/boards/${boardId}/members`, `/projects/${workspaceId}/${boardId}`, data)
}