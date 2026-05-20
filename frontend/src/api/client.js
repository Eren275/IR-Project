/**
 * HTTP client for the Python backend (Flask / FastAPI).
 * Dev: leave VITE_API_BASE empty — Vite proxies /api → Python server.
 */

const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

export function apiUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {}, signal } = options;

  let res;
  try {
    res = await fetch(apiUrl(path), {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body ?? undefined,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("Cannot reach the API. Start the Python server (python api.py).");
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err.detail ?? err.message ?? err.error ?? message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

/** Days until departure — integers >= 1 only */
export function parseDaysAhead(raw) {
  const n = Math.round(Number(raw));
  if (raw === "" || Number.isNaN(n) || !Number.isFinite(n) || n < 1) {
    return { valid: false, days: null, message: "Days must be 1 or greater." };
  }
  return {
    valid: true,
    days: n,
    label: `${n} day${n === 1 ? "" : "s"} until departure`,
  };
}

export const api = {
  health: () => apiRequest("/api/health"),

  stats: () => apiRequest("/api/stats"),

  insights: () => apiRequest("/api/insights"),

  recommend: (origin, destination, params = {}) => {
    const q = new URLSearchParams({ origin, destination, ...params });
    return apiRequest(`/api/recommend?${q}`);
  },

  search: (query) => apiRequest(`/api/search?q=${encodeURIComponent(query)}`),

  /** GET query style (custom backend) */
  predictByRoute: (origin, destination, days) => {
    const q = new URLSearchParams({
      origin,
      dest: destination,
      destination,
      days: String(days),
    });
    return apiRequest(`/api/predict?${q}`);
  },

  /** POST JSON style (Flask README) */
  predictByFeatures: (body) =>
    apiRequest("/api/predict", { method: "POST", body: JSON.stringify(body) }),

  explore: (airline = "") => {
    const q = airline ? `?airline=${encodeURIComponent(airline)}` : "";
    return apiRequest(`/api/explore${q}`).catch(() => apiRequest(`/api/insights${q}`));
  },

  flights: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(q ? `/api/flights?${q}` : "/api/flights");
  },

  keywords: () => apiRequest("/api/keywords"),

  sentiment: (text) =>
    apiRequest("/api/sentiment", { method: "POST", body: JSON.stringify({ text }) }),
};
