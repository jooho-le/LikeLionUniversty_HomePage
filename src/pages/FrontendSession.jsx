import { BackLink, LinkGrid, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

const items = [
  { to: "/intro/frontend/content", title: "세션 내용", meta: "Frontend" },
  { to: "/intro/frontend/diary", title: "?기 세션 일기", meta: "Frontend" },
];

export default function FrontendSession() {
  return (
    <div className="page-stack">
      <BackLink to="/intro" label="소개" />
      <PageHeader eyebrow="Session" title="프론트엔드 세션" />
      <PlaceholderPanel title="프론트엔드" />
      <LinkGrid items={items} />
    </div>
  );
}
