import { BackLink, LinkGrid, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

const items = [
  { to: "/intro/backend/content", title: "세션 내용", meta: "Backend" },
  { to: "/intro/backend/diary", title: "?기 세션 일기", meta: "Backend" },
];

export default function BackendSession() {
  return (
    <div className="page-stack">
      <BackLink to="/intro" label="소개" />
      <PageHeader eyebrow="Session" title="백엔드 세션" />
      <PlaceholderPanel title="백엔드" />
      <LinkGrid items={items} />
    </div>
  );
}
