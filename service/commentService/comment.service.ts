"use server";

import { createData, noCacheRead } from "../apiService/crud";

export async function getComments(boardId: string, cardId: string) {
  return await noCacheRead(`/boards/${boardId}/cards/${cardId}/comments`, ["comments"]);
}

export async function createComment(
  boardId: string,
  cardId: string,
  data: { content: string; parentId?: string },
  projectId: string
) {
  return await createData(
    `/boards/${boardId}/cards/${cardId}/comments`,
    `/projects/${projectId}/${boardId}`,
    data
  );
}
