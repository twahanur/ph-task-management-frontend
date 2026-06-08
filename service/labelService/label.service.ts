"use server";

import { createData, deleteData, noCacheRead } from "../apiService/crud";

// Get all labels for a board
export async function getBoardLabels(boardId: string) {
  return await noCacheRead(`/boards/${boardId}/labels`, ["labels", boardId]);
}

// Create a new board-level label
export async function createBoardLabel(
  boardId: string,
  data: { name: string; color: string },
  projectId: string
) {
  return await createData(
    `/boards/${boardId}/labels`,
    `/projects/${projectId}/${boardId}`,
    data
  );
}

// Assign a label to a card
export async function assignLabelToCard(
  boardId: string,
  cardId: string,
  labelId: string,
  projectId: string
) {
  return await createData(
    `/boards/${boardId}/cards/${cardId}/labels`,
    `/projects/${projectId}/${boardId}`,
    { labelId }
  );
}

// Unassign a label from a card
export async function unassignLabelFromCard(
  boardId: string,
  cardId: string,
  labelId: string,
  projectId: string
) {
  return await deleteData(
    `/boards/${boardId}/cards/${cardId}/labels/${labelId}`,
    `/projects/${projectId}/${boardId}`
  );
}
