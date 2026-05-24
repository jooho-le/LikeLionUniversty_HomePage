import { useMemo, useState } from "react";
import { Check, FolderKanban, Pencil, Plus, RotateCcw, Save, ShieldCheck, Trash2, UserCog, UserRound, X } from "lucide-react";
import { PageHeader } from "../components/PageKit.jsx";
import {
  adminApproveUser,
  adminCreateProject,
  adminDeleteUser,
  adminDeleteProject,
  adminGetProjects,
  adminGetUsers,
  adminUpdateProject,
  adminUpdateUser,
} from "../lib/api.js";

const statusLabels = {
  pending: "승인 대기",
  approved: "승인 완료",
  rejected: "거절",
};

const roleLabels = {
  member: "일반 회원",
  staff: "운영진",
};

const statusFilters = [
  { key: "all", label: "전체" },
  { key: "pending", label: "승인 대기" },
  { key: "approved", label: "승인 완료" },
  { key: "rejected", label: "거절" },
];

const adminSections = [
  { key: "users", label: "회원 관리" },
  { key: "projects", label: "프로젝트 관리" },
];

const EMPTY_PROJECT_FORM = {
  title: "",
  description: "",
  tech_stack: "",
  github_url: "",
  demo_url: "",
  thumbnail: "",
};

function formatDate(value) {
  if (!value) return "날짜 없음";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 없음";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizeProjectForm(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim() || null,
    tech_stack: form.tech_stack.trim() || null,
    github_url: form.github_url.trim() || null,
    demo_url: form.demo_url.trim() || null,
    thumbnail: form.thumbnail.trim() || null,
  };
}

export default function Admin({ initialSection = "users" }) {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT_FORM);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const basicAuth = useMemo(
    () => ({
      username: credentials.username.trim(),
      password: credentials.password,
    }),
    [credentials],
  );

  const filteredUsers = useMemo(() => {
    if (statusFilter === "all") return users;
    return users.filter((user) => user.status === statusFilter);
  }, [statusFilter, users]);

  const pendingCount = users.filter((user) => user.status === "pending").length;
  const hasAdminCredentials = Boolean(basicAuth.username && basicAuth.password);

  const loadAdminData = async (section = activeSection) => {
    if (!basicAuth.username || !basicAuth.password) {
      setMessage({ type: "error", text: "관리자 아이디와 비밀번호를 입력해주세요." });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "loading", text: "관리자 데이터를 불러오는 중입니다." });

    try {
      const userData = await adminGetUsers(basicAuth);
      setUsers(userData);

      if (section === "projects") {
        const data = await adminGetProjects();
        setProjects(data);
        setMessage({ type: "success", text: "프로젝트 목록을 불러왔습니다." });
      } else {
        setMessage({ type: "success", text: "회원 목록을 불러왔습니다." });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMessage({ type: "", text: "" });
  };

  const runUserAction = async (label, action) => {
    setMessage({ type: "loading", text: `${label} 처리 중입니다.` });

    try {
      await action();
      const data = await adminGetUsers(basicAuth);
      setUsers(data);
      setMessage({ type: "success", text: `${label} 처리했습니다.` });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleApprove = (user) => {
    runUserAction(`${user.username} 승인`, () => adminApproveUser(user.id, basicAuth));
  };

  const handleReject = (user) => {
    runUserAction(`${user.username} 거절`, () => adminUpdateUser(user.id, { status: "rejected" }, basicAuth));
  };

  const handlePending = (user) => {
    runUserAction(`${user.username} 대기 전환`, () => adminUpdateUser(user.id, { status: "pending" }, basicAuth));
  };

  const handleMakeStaff = (user) => {
    runUserAction(`${user.username} 운영진 전환`, () =>
      adminUpdateUser(user.id, { role: "staff", status: "approved" }, basicAuth),
    );
  };

  const handleMakeMember = (user) => {
    runUserAction(`${user.username} 일반 회원 전환`, () =>
      adminUpdateUser(user.id, { role: "member" }, basicAuth),
    );
  };

  const handleDelete = (user) => {
    const ok = window.confirm(`${user.username} 계정을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`);
    if (!ok) return;

    runUserAction(`${user.username} 삭제`, () => adminDeleteUser(user.id, basicAuth));
  };

  const loadProjects = async () => {
    if (!hasAdminCredentials) {
      setMessage({ type: "error", text: "관리자 아이디와 비밀번호를 입력해주세요." });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "loading", text: "프로젝트 목록을 불러오는 중입니다." });

    try {
      await adminGetUsers(basicAuth);
      const data = await adminGetProjects();
      setProjects(data);
      setMessage({ type: "success", text: "프로젝트 목록을 불러왔습니다." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const resetProjectForm = () => {
    setProjectForm(EMPTY_PROJECT_FORM);
    setEditingProjectId(null);
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    if (!hasAdminCredentials) {
      setMessage({ type: "error", text: "관리자 아이디와 비밀번호를 입력해주세요." });
      return;
    }
    if (!projectForm.title.trim()) {
      setMessage({ type: "error", text: "프로젝트 제목은 필수입니다." });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "loading", text: editingProjectId ? "프로젝트를 수정하는 중입니다." : "프로젝트를 등록하는 중입니다." });

    try {
      const body = normalizeProjectForm(projectForm);
      if (editingProjectId) {
        await adminUpdateProject(editingProjectId, body, basicAuth);
      } else {
        await adminCreateProject(body, basicAuth);
      }
      resetProjectForm();
      const data = await adminGetProjects();
      setProjects(data);
      setMessage({ type: "success", text: editingProjectId ? "프로젝트를 수정했습니다." : "프로젝트를 등록했습니다." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title ?? "",
      description: project.description ?? "",
      tech_stack: project.tech_stack ?? "",
      github_url: project.github_url ?? "",
      demo_url: project.demo_url ?? "",
      thumbnail: project.thumbnail ?? "",
    });
  };

  const handleDeleteProject = async (project) => {
    const ok = window.confirm(`${project.title} 프로젝트를 삭제할까요? 이 작업은 되돌릴 수 없습니다.`);
    if (!ok) return;
    if (!hasAdminCredentials) {
      setMessage({ type: "error", text: "관리자 아이디와 비밀번호를 입력해주세요." });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "loading", text: "프로젝트를 삭제하는 중입니다." });

    try {
      await adminDeleteProject(project.id, basicAuth);
      if (editingProjectId === project.id) resetProjectForm();
      const data = await adminGetProjects();
      setProjects(data);
      setMessage({ type: "success", text: "프로젝트를 삭제했습니다." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Admin"
        title="관리자"
        description="배포 후에도 DB를 직접 수정하지 않고 회원 승인과 운영진 권한을 관리합니다."
      />

      <section className="admin-auth-panel">
        <div>
          <span className="eyebrow">Basic Auth</span>
          <h2>관리자 인증</h2>
          <p>백엔드 `.env`의 ADMIN_USERNAME, ADMIN_PASSWORD를 입력합니다.</p>
        </div>
        <label>
          <span>관리자 아이디</span>
          <input
            type="text"
            placeholder="admin"
            value={credentials.username}
            onChange={(event) => setCredentials((value) => ({ ...value, username: event.target.value }))}
          />
        </label>
        <label>
          <span>관리자 비밀번호</span>
          <input
            type="password"
            placeholder="admin password"
            value={credentials.password}
            onChange={(event) => setCredentials((value) => ({ ...value, password: event.target.value }))}
          />
        </label>
        <button type="button" disabled={isLoading} onClick={() => loadAdminData(activeSection)}>
          <ShieldCheck size={17} strokeWidth={1.8} />
          관리자 인증
        </button>
      </section>

      {message.text && <p className={`session-form-message admin-message ${message.type}`}>{message.text}</p>}

      <section className="admin-tabs" aria-label="관리자 메뉴">
        {adminSections.map((section) => (
          <button
            className={activeSection === section.key ? "is-active" : ""}
            key={section.key}
            type="button"
            onClick={() => handleSectionChange(section.key)}
          >
            {section.key === "projects" && <FolderKanban size={16} strokeWidth={1.9} />}
            {section.label}
          </button>
        ))}
      </section>

      {activeSection === "users" && (
        <>
          <section className="admin-summary-grid" aria-label="회원 관리 요약">
            <article>
              <span>전체 회원</span>
              <strong>{users.length}</strong>
            </article>
            <article>
              <span>승인 대기</span>
              <strong>{pendingCount}</strong>
            </article>
            <article>
              <span>운영진</span>
              <strong>{users.filter((user) => user.role === "staff").length}</strong>
            </article>
          </section>

          <section className="admin-users-panel">
        <div className="admin-panel-head">
          <div>
            <span className="eyebrow">Users</span>
            <h2>회원 관리</h2>
          </div>
          <div className="admin-filter-list" aria-label="회원 상태 필터">
            {statusFilters.map((filter) => (
              <button
                className={statusFilter === filter.key ? "is-active" : ""}
                key={filter.key}
                type="button"
                onClick={() => setStatusFilter(filter.key)}
              >
                {filter.label}
                  </button>
                ))}
              </div>
              <button className="admin-load-button" type="button" disabled={isLoading} onClick={() => loadAdminData("users")}>
                <ShieldCheck size={15} strokeWidth={1.9} />
                목록 불러오기
              </button>
        </div>

        <div className="admin-user-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <article className="admin-user-card" key={user.id}>
                <div className="admin-user-main">
                  <span className={`admin-status-pill ${user.status}`}>{statusLabels[user.status] ?? user.status}</span>
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                  <div className="admin-user-meta">
                    <span>{roleLabels[user.role] ?? user.role}</span>
                    {user.major && <span>{user.major}</span>}
                    {user.student_id && <span>{user.student_id}</span>}
                    {user.phone && <span>{user.phone}</span>}
                    <span>{formatDate(user.created_at)}</span>
                  </div>
                </div>

                <div className="admin-user-actions">
                  <button type="button" onClick={() => handleApprove(user)}>
                    <Check size={15} strokeWidth={1.9} />
                    승인
                  </button>
                  <button type="button" onClick={() => handleReject(user)}>
                    <X size={15} strokeWidth={1.9} />
                    거절
                  </button>
                  <button type="button" onClick={() => handlePending(user)}>
                    <RotateCcw size={15} strokeWidth={1.9} />
                    대기
                  </button>
                  <button type="button" onClick={() => handleMakeStaff(user)}>
                    <UserCog size={15} strokeWidth={1.9} />
                    운영진
                  </button>
                  <button type="button" onClick={() => handleMakeMember(user)}>
                    <UserRound size={15} strokeWidth={1.9} />
                    일반
                  </button>
                  <button className="danger" type="button" onClick={() => handleDelete(user)}>
                    <Trash2 size={15} strokeWidth={1.9} />
                    삭제
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="admin-empty">조건에 맞는 회원이 없습니다.</p>
          )}
        </div>
          </section>
        </>
      )}

      {activeSection === "projects" && (
        <section className="admin-users-panel">
          <div className="admin-panel-head">
            <div>
              <span className="eyebrow">Projects</span>
              <h2>프로젝트 관리</h2>
            </div>
            <button className="admin-load-button" type="button" disabled={isLoading} onClick={loadProjects}>
              <ShieldCheck size={15} strokeWidth={1.9} />
              목록 불러오기
            </button>
          </div>

          <form className="admin-project-form" onSubmit={handleProjectSubmit}>
            <div className="admin-project-form-head">
              <div>
                <span className="eyebrow">{editingProjectId ? "Edit" : "Create"}</span>
                <h3>{editingProjectId ? "프로젝트 수정" : "프로젝트 등록"}</h3>
              </div>
              {editingProjectId && (
                <button type="button" onClick={resetProjectForm}>
                  <X size={15} strokeWidth={1.9} />
                  취소
                </button>
              )}
            </div>

            <label>
              프로젝트 제목
              <input
                type="text"
                value={projectForm.title}
                onChange={(event) => setProjectForm((value) => ({ ...value, title: event.target.value }))}
                placeholder="예: 로컬마켓"
                required
              />
            </label>
            <label>
              상세 설명
              <textarea
                rows={4}
                value={projectForm.description}
                onChange={(event) => setProjectForm((value) => ({ ...value, description: event.target.value }))}
                placeholder="프로젝트 목적, 주요 기능, 성과를 입력합니다."
              />
            </label>
            <div className="admin-project-grid">
              <label>
                기술 스택
                <input
                  type="text"
                  value={projectForm.tech_stack}
                  onChange={(event) => setProjectForm((value) => ({ ...value, tech_stack: event.target.value }))}
                  placeholder="React, FastAPI, PostgreSQL"
                />
              </label>
              <label>
                썸네일 URL
                <input
                  type="url"
                  value={projectForm.thumbnail}
                  onChange={(event) => setProjectForm((value) => ({ ...value, thumbnail: event.target.value }))}
                  placeholder="https://..."
                />
              </label>
              <label>
                GitHub URL
                <input
                  type="url"
                  value={projectForm.github_url}
                  onChange={(event) => setProjectForm((value) => ({ ...value, github_url: event.target.value }))}
                  placeholder="https://github.com/..."
                />
              </label>
              <label>
                Demo URL
                <input
                  type="url"
                  value={projectForm.demo_url}
                  onChange={(event) => setProjectForm((value) => ({ ...value, demo_url: event.target.value }))}
                  placeholder="https://..."
                />
              </label>
            </div>
            <button className="admin-primary-button" type="submit" disabled={isLoading}>
              {editingProjectId ? <Save size={16} strokeWidth={1.9} /> : <Plus size={16} strokeWidth={1.9} />}
              {editingProjectId ? "수정 저장" : "프로젝트 등록"}
            </button>
          </form>

          <div className="admin-user-list">
            {projects.length > 0 ? (
              projects.map((project) => (
                <article className="admin-user-card" key={project.id}>
                  <div className="admin-user-main">
                    <span className="admin-status-pill">{project.tech_stack || "기술 스택 없음"}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description || "설명 없음"}</p>
                    <div className="admin-user-meta">
                      {project.github_url && <span>GitHub</span>}
                      {project.demo_url && <span>Demo</span>}
                      {project.thumbnail && <span>Thumbnail</span>}
                      <span>{formatDate(project.created_at)}</span>
                    </div>
                  </div>

                  <div className="admin-user-actions">
                    <button type="button" onClick={() => handleEditProject(project)}>
                      <Pencil size={15} strokeWidth={1.9} />
                      수정
                    </button>
                    <button className="danger" type="button" onClick={() => handleDeleteProject(project)}>
                      <Trash2 size={15} strokeWidth={1.9} />
                      삭제
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="admin-empty">등록된 프로젝트가 없습니다.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
