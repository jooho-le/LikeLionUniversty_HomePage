import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function NotFound() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="404" title="페이지 없음" />
      <PlaceholderPanel title="??" />
      <Link className="primary-link" to="/">
        <Home size={17} />
        <span>홈</span>
      </Link>
    </div>
  );
}
