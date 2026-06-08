import { TCreateProjectPayload } from "@/types/projectType/project.type"
import { createData, readData, patchData, deleteData } from "../apiService/crud"

export const createWorkspace = async (data: TCreateProjectPayload) => {
    return createData("/workspaces", "/dashboard/projects", data)
}

export const getAllWorkspaces = async () => {
    return readData("/workspaces", ["/workspaces"])
}

export const getWorkspaceById = async (id: string) => {
    return readData(`/workspaces/${id}`, ["/workspaces"])
}

export const updateWorkspaceMemberRole = async (workspaceId: string, userId: string, data: { role: string }) => {
    return patchData(`/workspaces/${workspaceId}/members/${userId}`, `/workspaces/${workspaceId}`, data)
}

export const removeWorkspaceMember = async (workspaceId: string, userId: string) => {
    return deleteData(`/workspaces/${workspaceId}/members/${userId}`, `/workspaces/${workspaceId}`)
}

export const addWorkspaceMember = async (workspaceId: string, data: { email: string; role: string }) => {
    return createData(`/workspaces/${workspaceId}/members`, `/workspaces/${workspaceId}`, data)
}