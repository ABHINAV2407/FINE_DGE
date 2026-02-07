class CacheService {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttlMs) {
    const expiry = Date.now() + ttlMs;

    this.cache.set(key, { value, expiry });

    // auto delete after TTL
    setTimeout(() => {
      this.cache.delete(key);
    }, ttlMs);
  }

  get(key) {
    const data = this.cache.get(key);

    if (!data) return null;

    // check expiry
    if (Date.now() > data.expiry) {
      this.cache.delete(key);
      return null;
    }

    return data.value;
  }

  delete(key) {
    this.cache.delete(key);
  }
}

module.exports = new CacheService();
