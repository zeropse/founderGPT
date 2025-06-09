interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
}

class APICache {
  private cache = new Map<string, CacheEntry>();
  private pendingRequests = new Map<string, Promise<any>>();

  generateKey(url: string, options: RequestInit = {}): string {
    const method = options.method || "GET";
    const body = options.body || "";
    return `${method}:${url}:${body}`;
  }

  isValid(entry: CacheEntry, maxAge: number = 30000): boolean {
    return Date.now() - entry.timestamp < maxAge;
  }

  get<T = any>(url: string, options: RequestInit, maxAge: number): T | null {
    const key = this.generateKey(url, options);
    const entry = this.cache.get(key);

    if (entry && this.isValid(entry, maxAge)) {
      return entry.data;
    }

    return null;
  }

  set<T = any>(url: string, options: RequestInit, data: T): void {
    const key = this.generateKey(url, options);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(urlPattern: string): void {
    for (const [key] of this.cache) {
      if (key.includes(urlPattern)) {
        this.cache.delete(key);
      }
    }
  }

  clearAll(): void {
    this.cache.clear();
  }

  async fetch<T = any>(url: string, options: RequestInit = {}, maxAge: number = 30000): Promise<T> {
    const key = this.generateKey(url, options);

    const cached = this.get<T>(url, options, maxAge);
    if (cached) {
      return cached;
    }

    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const requestPromise = fetch(url, options)
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          this.set(url, options, data);
        }

        this.pendingRequests.delete(key);
        return data;
      })
      .catch((error) => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }
}

export const apiCache = new APICache();

export const cachedFetch = <T = any>(
  url: string,
  options?: RequestInit,
  maxAge?: number
): Promise<T> => {
  return apiCache.fetch<T>(url, options, maxAge);
};

export default apiCache;