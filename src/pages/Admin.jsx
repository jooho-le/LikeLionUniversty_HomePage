import { useMemo, useState } from "react";
import { Check, RotateCcw, ShieldCheck, Trash2, UserCog, UserRound, X } from "lucide-react";
import { PageHeader } from "../components/PageKit.jsx";
import {
  adminApproveUser,
  adminDeleteUser,
  adminGetUsers,
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

export default function Admin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [users, setUsers] = useState([]);
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

  const loadUsers = async () => {
    if (!basicAuth.username || !basicAuth.password) {
      setMessage({ type: "error", text: "관리자 아이디와 비밀번호를 입력해주세요." });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "loading", text: "회원 목록을 불러오는 중입니다." });

    try {
      const data = await adminGetUsers(basicAuth);
      setUsers(data);
      setMessage({ type: "success", text: "회원 목록을 불러왔습니다." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
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
        <button type="button" disabled={isLoading} onClick={loadUsers}>
          <ShieldCheck size={17} strokeWidth={1.8} />
          회원 목록 불러오기
        </button>
      </section>

      {message.text && <p className={`session-form-message admin-message ${message.type}`}>{message.text}</p>}

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
    </div>
  );
}
