import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { PageHeader } from "../components/PageKit.jsx";
import { clearStoredTokens, getStoredAccessToken, login, setStoredTokens } from "../lib/api.js";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [hasToken, setHasToken] = useState(Boolean(getStoredAccessToken()));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setStatus({ type: "error", message: "이메일과 비밀번호를 모두 입력해주세요." });
      return;
    }

    setStatus({ type: "loading", message: "로그인 중입니다." });

    try {
      const tokens = await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      setStoredTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
      setHasToken(true);
      setStatus({ type: "success", message: "로그인되었습니다. 세션 게시판에서 글을 작성할 수 있습니다." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleLogout = () => {
    clearStoredTokens();
    setHasToken(false);
    setStatus({ type: "success", message: "저장된 로그인 토큰을 삭제했습니다." });
  };

  return (
    <div className="page-stack login-page">
      <PageHeader eyebrow="Login" title="로그인" />
      <form className="login-panel" onSubmit={handleSubmit}>
        <label>
          <span>이메일</span>
          <input
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(event) => setFormData((value) => ({ ...value, email: event.target.value }))}
          />
        </label>
        <label>
          <span>비밀번호</span>
          <input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(event) => setFormData((value) => ({ ...value, password: event.target.value }))}
          />
        </label>
        {status.message && <p className={`session-form-message ${status.type}`}>{status.message}</p>}
        <div className="login-actions">
          <button type="submit" disabled={status.type === "loading"}>
            <LogIn size={17} />
            <span>로그인</span>
          </button>
          {hasToken && (
            <button className="secondary-form-button" type="button" onClick={handleLogout}>
              토큰 삭제
            </button>
          )}
          <Link className="secondary-form-link" to="/register">
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
}
