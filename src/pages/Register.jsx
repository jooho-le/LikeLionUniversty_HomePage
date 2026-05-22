import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { PageHeader } from "../components/PageKit.jsx";
import { register } from "../lib/api.js";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    studentId: "",
    major: "",
    phone: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (field) => (event) => {
    setFormData((value) => ({ ...value, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      setStatus({ type: "error", message: "닉네임, 이메일, 비밀번호는 필수입니다." });
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setStatus({ type: "error", message: "비밀번호 확인이 일치하지 않습니다." });
      return;
    }

    setStatus({ type: "loading", message: "회원가입 요청을 보내는 중입니다." });

    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        studentId: formData.studentId.trim(),
        major: formData.major.trim(),
        phone: formData.phone.trim(),
      });
      setFormData({
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
        studentId: "",
        major: "",
        phone: "",
      });
      setStatus({
        type: "success",
        message: "회원가입이 완료되었습니다. 운영진 승인 후 로그인할 수 있습니다.",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="page-stack login-page">
      <PageHeader
        eyebrow="Register"
        title="회원가입"
        description="가입 후 상태는 승인 대기입니다. 운영진이 승인하면 로그인할 수 있습니다."
      />
      <form className="login-panel register-panel" onSubmit={handleSubmit}>
        <label>
          <span>닉네임</span>
          <input
            type="text"
            placeholder="이름 또는 닉네임"
            value={formData.username}
            onChange={handleChange("username")}
          />
        </label>
        <label>
          <span>이메일</span>
          <input
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange("email")}
          />
        </label>
        <label>
          <span>비밀번호</span>
          <input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange("password")}
          />
        </label>
        <label>
          <span>비밀번호 확인</span>
          <input
            type="password"
            placeholder="비밀번호 다시 입력"
            value={formData.passwordConfirm}
            onChange={handleChange("passwordConfirm")}
          />
        </label>
        <label>
          <span>학번</span>
          <input
            type="text"
            placeholder="선택 입력"
            value={formData.studentId}
            onChange={handleChange("studentId")}
          />
        </label>
        <label>
          <span>전공</span>
          <input
            type="text"
            placeholder="선택 입력"
            value={formData.major}
            onChange={handleChange("major")}
          />
        </label>
        <label>
          <span>전화번호</span>
          <input
            type="tel"
            placeholder="선택 입력"
            value={formData.phone}
            onChange={handleChange("phone")}
          />
        </label>
        {status.message && <p className={`session-form-message ${status.type}`}>{status.message}</p>}
        <div className="login-actions">
          <button type="submit" disabled={status.type === "loading"}>
            <UserPlus size={17} />
            <span>회원가입</span>
          </button>
          <Link className="secondary-form-link" to="/login">
            로그인으로
          </Link>
        </div>
      </form>
    </div>
  );
}
