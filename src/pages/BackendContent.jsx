import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function BackendContent() {
  return (
    <div className="page-stack">
      <BackLink to="/intro/backend" label="백엔드 세션" />
      <PageHeader eyebrow="Backend" title="세션 내용" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
