"use server";

import { createData, deleteData, patchData } from "../apiService/crud";

export async function createChecklist(
  boardId: string,
  cardId: string,
  data: { title: string; position: number },
  projectId: string
) {
  return await createData(
    `/boards/${boardId}/cards/${cardId}/checklists`,
    `/projects/${projectId}/${boardId}`,
    data
  );
}

export async function deleteChecklist(
  boardId: string,
  checklistId: string,
  projectId: string
) {
  return await deleteData(
    `/boards/${boardId}/checklists/${checklistId}`,
    `/projects/${projectId}/${boardId}`
  );
}

export async function addChecklistItem(
  boardId: string,
  checklistId: string,
  data: { title: string },
  projectId: string
) {
  return await createData(
    `/boards/${boardId}/checklists/${checklistId}/items`,
    `/projects/${projectId}/${boardId}`,
    data
  );
}

export async function toggleChecklistItem(
  boardId: string,
  checklistId: string,
  itemId: string,
  projectId: string
) {
  return await patchData(
    `/boards/${boardId}/checklists/${checklistId}/items/${itemId}/toggle`,
    `/projects/${projectId}/${boardId}`,
    {}
  );
}

export async function updateChecklist(
  boardId: string,
  id: string,
  data: { title: string },
  projectId: string
) {
  return await patchData(
    `/boards/${boardId}/checklists/${id}`,
    `/projects/${projectId}/${boardId}`,
    data
  );
}

export async function updateChecklistItem(
  boardId: string,
  id: string,
  data: {
    title?: string;
    is_completed?: boolean;
    due_date?: string | null;
    assigned_to?: string | null;
    position?: number;
  },
  projectId: string
) {
  return await patchData(
    `/boards/${boardId}/items/${id}`,
    `/projects/${projectId}/${boardId}`,
    data
  );
}
