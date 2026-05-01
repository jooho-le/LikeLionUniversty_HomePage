import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function BackendDiary() {
  return (
    <div className="page-stack">
      <BackLink to="/intro/backend" label="백엔드 세션" />
      <PageHeader eyebrow="Backend" title="?기 세션 일기" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
