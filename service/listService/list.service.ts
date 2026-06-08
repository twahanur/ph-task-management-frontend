import { createData, readData, patchData, deleteData } from "../apiService/crud";

export async function createList(boardId: string, data: { name: string }, projectId: string) {
    return await createData(`/boards/${boardId}/lists`, `/projects/${projectId}/${boardId}`, data)
}

export async function createCard(boardId:string,listId:string,data:object,projectId:string){
    return await createData(`/boards/${boardId}/lists/${listId}/cards`, `/projects/${projectId}/${boardId}`, data)
}


export async function addMemberToCard(boardId: string, cardId: string, userId: string, projectId: string) {
     return await createData(`/boards/${boardId}/cards/${cardId}/assign`, `/projects/${projectId}/${boardId}`, {userId})
}

export async function removeMemberFromCard(boardId: string, cardId: string, userId: string, projectId: string) {
     return await deleteData(`/boards/${boardId}/cards/${cardId}/assign/${userId}`, `/projects/${projectId}/${boardId}`)
}

export async function updateCard(boardId: string, cardId: string, data: object, projectId: string) {
     return await patchData(`/boards/${boardId}/cards/${cardId}`, `/projects/${projectId}/${boardId}`, data)
}

export async function getCard(boardId: string, cardId: string) {
     return await readData(`/boards/${boardId}/cards/${cardId}`, ["card"])
}

export async function reorderLists(boardId: string, data: { lists: { id: string, position: number }[] }, projectId: string) {
     return await patchData(`/boards/${boardId}/lists/reorder`, `/projects/${projectId}/${boardId}`, data)
}

export async function moveCard(boardId: string, cardId: string, data: { targetListId: string, position: number }, projectId: string) {
     return await createData(`/boards/${boardId}/cards/${cardId}/move`, `/projects/${projectId}/${boardId}`, data)
}

export async function duplicateCard(boardId: string, cardId: string, projectId: string) {
     return await createData(`/boards/${boardId}/cards/${cardId}/duplicate`, `/projects/${projectId}/${boardId}`, {})
}