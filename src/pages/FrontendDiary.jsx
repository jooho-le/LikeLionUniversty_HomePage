import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function FrontendDiary() {
  return (
    <div className="page-stack">
      <BackLink to="/intro/frontend" label="프론트엔드 세션" />
      <PageHeader eyebrow="Frontend" title="?기 세션 일기" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
