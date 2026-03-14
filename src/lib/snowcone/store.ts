// ─── Snowcone Content Store — In-memory approval queue ─────────────
// Persists for the session. Will move to Notion once connected.

import type { GeneratedContent } from './types';

interface ContentStore {
  queue: GeneratedContent[];
  approved: GeneratedContent[];
  rejected: GeneratedContent[];
}

const store: ContentStore = {
  queue: [],
  approved: [],
  rejected: [],
};

export function addToQueue(items: GeneratedContent[]) {
  store.queue.push(...items);
}

export function approveContent(id: string): GeneratedContent | null {
  const idx = store.queue.findIndex(c => c.id === id);
  if (idx === -1) return null;
  const [item] = store.queue.splice(idx, 1);
  item.status = 'queued';
  store.approved.push(item);
  return item;
}

export function rejectContent(id: string): GeneratedContent | null {
  const idx = store.queue.findIndex(c => c.id === id);
  if (idx === -1) return null;
  const [item] = store.queue.splice(idx, 1);
  item.status = 'cut';
  store.rejected.push(item);
  return item;
}

export function getQueue(): GeneratedContent[] {
  return store.queue;
}

export function getApproved(): GeneratedContent[] {
  return store.approved;
}

export function getRejected(): GeneratedContent[] {
  return store.rejected;
}

export function getAllContent(): ContentStore {
  return { ...store };
}

export function clearQueue() {
  store.queue = [];
}
