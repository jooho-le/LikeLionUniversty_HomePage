import { LogIn } from "lucide-react";
import { PageHeader } from "../components/PageKit.jsx";

export default function Login() {
  return (
    <div className="page-stack login-page">
      <PageHeader eyebrow="Login" title="로그인" />
      <form className="login-panel">
        <label>
          <span>?기 아이디</span>
          <input type="text" placeholder="??" />
        </label>
        <label>
          <span>?기 비밀번호</span>
          <input type="password" placeholder="??" />
        </label>
        <button type="button">
          <LogIn size={17} />
          <span>로그인</span>
        </button>
      </form>
    </div>
  );
}
