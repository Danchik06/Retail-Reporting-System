import "server-only";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 минут
const MAX_ENTRIES = 10000;

// Хранилище живёт в globalThis, чтобы переживать перезагрузки кода в разработке
const store = (globalThis.loginAttempts ??= new Map());

function purgeExpired(now) {
  for (const [key, entry] of store) {
    if (now - entry.firstAt >= WINDOW_MS) {
      store.delete(key);
    }
  }
}

// Засчитывает попытку входа и сообщает, разрешена ли она.
// Функция синхронная, поэтому одновременные запросы не могут её обойти.
export function takeLoginAttempt(key) {
  const now = Date.now();

  if (store.size >= MAX_ENTRIES) {
    purgeExpired(now);
  }

  let entry = store.get(key);

  if (!entry || now - entry.firstAt >= WINDOW_MS) {
    entry = { count: 0, firstAt: now };
    store.set(key, entry);
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.firstAt + WINDOW_MS - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

// Вызывается после успешного входа: сбрасывает счётчик
export function resetLoginAttempts(key) {
  store.delete(key);
}