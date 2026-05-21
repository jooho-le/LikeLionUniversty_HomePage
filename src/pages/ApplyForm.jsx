import { useState } from "react";
import { Send } from "lucide-react";
import { BackLink, PageHeader } from "../components/PageKit.jsx";
import { createApplication } from "../lib/api.js";

export default function ApplyForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    motivation: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (field) => (event) => {
    setFormData((value) => ({ ...value, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setStatus({ type: "error", message: "이름과 이메일은 필수입니다." });
      return;
    }

    setStatus({ type: "loading", message: "신청서를 제출하는 중입니다." });

    try {
      await createApplication({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        motivation: formData.motivation.trim() || null,
      });
      setFormData({ name: "", email: "", phone: "", motivation: "" });
      setStatus({ type: "success", message: "신청서가 제출되었습니다. 상태는 pending으로 저장됩니다." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="page-stack">
      <BackLink to="/apply" label="신청" />
      <PageHeader
        eyebrow="Application"
        title="14기 신청하기"
        description="입력한 신청서는 백엔드 /apply API로 제출됩니다."
      />
      <form className="form-panel" onSubmit={handleSubmit}>
        <label>
          <span>이름</span>
          <input type="text" placeholder="홍길동" value={formData.name} onChange={handleChange("name")} />
        </label>
        <label>
          <span>이메일</span>
          <input type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange("email")} />
        </label>
        <label>
          <span>전화번호</span>
          <input type="tel" placeholder="010-0000-0000" value={formData.phone} onChange={handleChange("phone")} />
        </label>
        <label>
          <span>지원 동기</span>
          <textarea
            placeholder="멋쟁이사자처럼에 지원하는 이유를 적어주세요."
            rows="6"
            value={formData.motivation}
            onChange={handleChange("motivation")}
          />
        </label>
        {status.message && <p className={`session-form-message ${status.type}`}>{status.message}</p>}
        <button type="submit" disabled={status.type === "loading"}>
          <Send size={17} />
          <span>신청하기</span>
        </button>
      </form>
    </div>
  );
}
