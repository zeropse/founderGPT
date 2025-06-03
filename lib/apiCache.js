class APICache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  generateKey(url, options = {}) {
    const method = options.method || "GET";
    const body = options.body || "";
    return `${method}:${url}:${body}`;
  }

  isValid(entry, maxAge = 30000) {
    return Date.now() - entry.timestamp < maxAge;
  }

  get(url, options, maxAge) {
    const key = this.generateKey(url, options);
    const entry = this.cache.get(key);

    if (entry && this.isValid(entry, maxAge)) {
      return entry.data;
    }

    return null;
  }

  set(url, options, data) {
    const key = this.generateKey(url, options);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(urlPattern) {
    for (const [key] of this.cache) {
      if (key.includes(urlPattern)) {
        this.cache.delete(key);
      }
    }
  }

  clearAll() {
    this.cache.clear();
  }

  async fetch(url, options = {}, maxAge = 30000) {
    const key = this.generateKey(url, options);

    const cached = this.get(url, options, maxAge);
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

export const cachedFetch = (url, options, maxAge) => {
  return apiCache.fetch(url, options, maxAge);
};

export default apiCache;
