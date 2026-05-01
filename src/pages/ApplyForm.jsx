import { Send } from "lucide-react";
import { BackLink, PageHeader } from "../components/PageKit.jsx";

export default function ApplyForm() {
  return (
    <div className="page-stack">
      <BackLink to="/apply" label="신청" />
      <PageHeader eyebrow="Application" title="?기 신청하기" />
      <form className="form-panel">
        <label>
          <span>??</span>
          <input type="text" placeholder="??" />
        </label>
        <label>
          <span>??</span>
          <input type="email" placeholder="??" />
        </label>
        <label>
          <span>??</span>
          <textarea placeholder="??" rows="5" />
        </label>
        <button type="button">
          <Send size={17} />
          <span>신청하기</span>
        </button>
      </form>
    </div>
  );
}
