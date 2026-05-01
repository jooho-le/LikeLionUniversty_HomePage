import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function FrontendContent() {
  return (
    <div className="page-stack">
      <BackLink to="/intro/frontend" label="프론트엔드 세션" />
      <PageHeader eyebrow="Frontend" title="세션 내용" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
