// Универсальная обёртка под наш бэкенд.
// Умеет: GET/POST/PUT/DELETE, JSON, ошибки, no-store.
// Для приватных запросов на том же домене можно включить credentials.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(
  path,
  { method = "GET", body, headers = {}, credentials } = {}
) {
  const init = {
    method,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...headers },
  };

  if (body !== undefined)
    init.body = typeof body === "string" ? body : JSON.stringify(body);

  // если фронт и бэк на одном домене (через Nginx), можно включать cookie:
  if (credentials) init.credentials = credentials; // 'include' | 'same-origin'

  const res = await fetch(`${BASE_URL}${path}`, init);
  let data = null;
  try {
    data = await res.json();
  } catch (_) {}

  if (!res.ok || data?.success === false) {
    const msg = data?.message || `API error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  // чаще всего полезен data.data, но иногда нужен весь ответ
  return data?.data !== undefined ? data.data : data;
}

// Шорткаты
export const api = {
  get: (p, opt = {}) => request(p, { ...opt, method: "GET" }),
  post: (p, body, opt = {}) => request(p, { ...opt, method: "POST", body }),
  put: (p, body, opt = {}) => request(p, { ...opt, method: "PUT", body }),
  del: (p, opt = {}) => request(p, { ...opt, method: "DELETE" }),
};

export default api;
