"use server";

import { uploadFile, deleteData } from "../apiService/crud";

export async function uploadAttachment(
  boardId: string,
  cardId: string,
  formData: FormData,
  projectId: string
) {
  return await uploadFile(
    `/boards/${boardId}/cards/${cardId}/attachments`,
    `/projects/${projectId}/${boardId}`,
    formData
  );
}

export async function deleteAttachment(
  boardId: string,
  attachmentId: string,
  projectId: string
) {
  return await deleteData(
    `/boards/${boardId}/attachments/${attachmentId}`,
    `/projects/${projectId}/${boardId}`
  );
}
