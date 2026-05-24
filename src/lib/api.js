const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const AUTH_STORAGE_EVENT = "likelion-auth-change";

export function getApiAssetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getStoredAccessToken() {
  return localStorage.getItem("likelionAccessToken") ?? "";
}

export function isAuthenticated() {
  return Boolean(getStoredAccessToken());
}

export function subscribeAuthChange(callback) {
  const handleAuthChange = () => callback(isAuthenticated());
  const handleStorage = (event) => {
    if (event.key === "likelionAccessToken" || event.key === "likelionRefreshToken") {
      handleAuthChange();
    }
  };

  window.addEventListener(AUTH_STORAGE_EVENT, handleAuthChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(AUTH_STORAGE_EVENT, handleAuthChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
}

export function setStoredTokens({ accessToken, refreshToken }) {
  localStorage.setItem("likelionAccessToken", accessToken);
  localStorage.setItem("likelionRefreshToken", refreshToken);
  notifyAuthChange();
}

export function clearStoredTokens() {
  localStorage.removeItem("likelionAccessToken");
  localStorage.removeItem("likelionRefreshToken");
  notifyAuthChange();
}

function withQuery(path, params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

async function parseResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return response.text();
  }

  return response.json();
}

export async function apiRequest(path, options = {}) {
  const { token, basicAuth, headers, ...rest } = options;
  const isFormData = rest.body instanceof FormData;
  const authorization = basicAuth
    ? `Basic ${btoa(`${basicAuth.username}:${basicAuth.password}`)}`
    : token
      ? `Bearer ${token}`
      : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(authorization ? { Authorization: authorization } : {}),
      ...headers,
    },
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    let message = "요청 처리에 실패했습니다.";

    if (typeof data === "object" && data?.detail) {
      message = Array.isArray(data.detail)
        ? data.detail.map((item) => item.msg ?? JSON.stringify(item)).join("\n")
        : data.detail;
    }

    if (typeof data === "object" && Array.isArray(data?.errors) && data.errors.length > 0) {
      message = `${message} ${data.errors
        .map((item) => `${item.field}: ${item.message}`)
        .join(" / ")}`;
    }

    throw new Error(message);
  }

  return data;
}

export async function login({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register({ username, email, password, studentId, major, phone }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      student_id: studentId || null,
      major: major || null,
      phone: phone || null,
    }),
  });
}

export async function getSessions(category) {
  return apiRequest(withQuery("/sessions", { category }));
}

export async function getDiaries(category) {
  return apiRequest(withQuery("/diary", { category }));
}

export async function createDiary({ title, content, category, token }) {
  return apiRequest("/diary", {
    method: "POST",
    token,
    body: JSON.stringify({ title, content, category }),
  });
}

export async function getMembers() {
  return apiRequest("/members");
}

export async function getProjects() {
  return apiRequest("/projects");
}

export async function getProject(projectId) {
  return apiRequest(`/projects/${projectId}`);
}

export async function adminGetProjects() {
  const projects = await getProjects();
  return Promise.all(projects.map((project) => getProject(project.id)));
}

export async function adminCreateProject(body, basicAuth) {
  return apiRequest("/admin/projects", {
    method: "POST",
    basicAuth,
    body: JSON.stringify(body),
  });
}

export async function adminUpdateProject(projectId, body, basicAuth) {
  return apiRequest(`/admin/projects/${projectId}`, {
    method: "PATCH",
    basicAuth,
    body: JSON.stringify(body),
  });
}

export async function adminDeleteProject(projectId, basicAuth) {
  return apiRequest(`/admin/projects/${projectId}`, {
    method: "DELETE",
    basicAuth,
  });
}

export async function adminGetSessions() {
  return getSessions();
}

export async function adminCreateSessionContent({ title, description, category, presenter, sessionDate, materialFile }, basicAuth) {
  const body = new FormData();
  body.append("title", title);
  body.append("category", category);
  if (description) body.append("description", description);
  if (presenter) body.append("presenter", presenter);
  if (sessionDate) body.append("session_date", sessionDate);
  if (materialFile) body.append("material_file", materialFile);

  return apiRequest("/admin/sessions/upload", {
    method: "POST",
    basicAuth,
    body,
  });
}

export async function adminDeleteSession(sessionId, basicAuth) {
  return apiRequest(`/admin/sessions/${sessionId}`, {
    method: "DELETE",
    basicAuth,
  });
}

export async function createApplication({ name, email, phone, motivation }) {
  return apiRequest("/apply", {
    method: "POST",
    body: JSON.stringify({ name, email, phone, motivation }),
  });
}

export async function getMe(token = getStoredAccessToken()) {
  return apiRequest("/users/me", { token });
}

export async function adminGetUsers(basicAuth) {
  return apiRequest("/admin/users", { basicAuth });
}

export async function adminUpdateUser(userId, body, basicAuth) {
  return apiRequest(`/admin/users/${userId}`, {
    method: "PATCH",
    basicAuth,
    body: JSON.stringify(body),
  });
}

export async function adminApproveUser(userId, basicAuth) {
  return apiRequest(`/admin/users/${userId}/approve`, {
    method: "PATCH",
    basicAuth,
  });
}

export async function adminDeleteUser(userId, basicAuth) {
  return apiRequest(`/admin/users/${userId}`, {
    method: "DELETE",
    basicAuth,
  });
}

export async function adminGetApplications(basicAuth) {
  return apiRequest("/admin/apply", { basicAuth });
}

export async function adminDeleteApplication(applyId, basicAuth) {
  return apiRequest(`/admin/apply/${applyId}`, {
    method: "DELETE",
    basicAuth,
  });
}
