const AI_PREFIX = 'ai_cache_';

export function getAiCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(AI_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return null;
  }
}

export function setAiCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(AI_PREFIX + key, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function removeAiCache(key: string): void {
  try {
    localStorage.removeItem(AI_PREFIX + key);
  } catch {
    // ignore
  }
}