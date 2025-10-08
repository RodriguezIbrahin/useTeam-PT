// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const N8N_WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK ||
  "http://localhost:5678/webhook/kanban-export";

export async function fetchBoards() {
  const res = await fetch(`${API_URL}/api/board`);
  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(
      `fetchBoards failed: ${res.status} ${txt || res.statusText}`
    );
  }
  return res.json();
}

export async function fetchBoard(boardId) {
  const res = await fetch(`${API_URL}/api/board/${boardId}`);
  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(
      `fetchBoard failed: ${res.status} ${txt || res.statusText}`
    );
  }
  return res.json();
}

export async function saveBoard(boardId, body) {
  const res = await fetch(`${API_URL}/api/board/${boardId}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(`saveBoard failed: ${res.status} ${txt || res.statusText}`);
  }
  return res.json();
}

/**
 * Envía la solicitud de export al backend (que a su vez llama n8n o envía directo)
 * body: { email, boardId, note? }
 */
export async function sendExport(body) {
  const res = await fetch(`${API_URL}/api/export/backlog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(
      `sendExport failed: ${res.status} ${txt || res.statusText}`
    );
  }
  return res.json().catch(() => ({ ok: true }));
}

/**
 * Envío directo (fallback): POST /api/export/backlog/direct-send
 * body: { boardId, email, note }
 */
export async function sendExportDirect({ email, boardId, note }) {
  const res = await fetch(`${API_URL}/api/export/backlog/direct-send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, boardId, note }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(
      `sendExportDirect failed: ${res.status} ${txt || res.statusText}`
    );
  }
  return res.json();
}
