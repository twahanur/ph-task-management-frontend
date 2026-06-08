"use server";

import { createData, deleteData, noCacheRead } from "../apiService/crud";

// ── Board-level custom field definitions ─────────────────────────────────────

/** GET all custom field definitions for a board */
export async function getBoardCustomFields(boardId: string) {
  return await noCacheRead(`/boards/${boardId}/custom-fields`, [
    "custom-fields",
    boardId,
  ]);
}

/**
 * POST create a new custom field definition on the board
 * body: { name, type, options? }
 * Only board admins can call this.
 */
export async function createCustomField(
  boardId: string,
  data: {
    name: string;
    type: "text" | "number" | "date" | "checkbox" | "dropdown";
    options?: string[];
  },
  projectId: string
) {
  return await createData(
    `/boards/${boardId}/custom-fields`,
    `/projects/${projectId}/${boardId}`,
    data
  );
}

/**
 * DELETE a custom field definition from the board
 * Only board admins can call this.
 */
export async function deleteCustomField(
  boardId: string,
  fieldId: string,
  projectId: string
) {
  return await deleteData(
    `/boards/${boardId}/custom-fields/${fieldId}`,
    `/projects/${projectId}/${boardId}`
  );
}

// ── Per-card custom field values ──────────────────────────────────────────────

/**
 * GET all custom field values for a specific card.
 * Returns: Array<{ field_id, value, field: { id, name, type, options } }>
 */
export async function getCardCustomFieldValues(boardId: string, cardId: string) {
  return await noCacheRead(
    `/boards/${boardId}/custom-fields/cards/${cardId}/values`,
    ["custom-field-values", cardId]
  );
}

/**
 * POST set / upsert a custom field value for a card.
 * Spec says POST (not PATCH).
 * body: { value: string }
 */
export async function setCustomFieldValue(
  boardId: string,
  cardId: string,
  customFieldId: string,
  value: string,
  projectId: string
) {
  return await createData(
    `/boards/${boardId}/custom-fields/cards/${cardId}/fields/${customFieldId}`,
    `/projects/${projectId}/${boardId}`,
    { value }
  );
}
