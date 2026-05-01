import { BackLink, LinkGrid, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

const items = [
  { to: "/intro/planning-design/content", title: "세션 내용", meta: "Planning" },
  { to: "/intro/planning-design/diary", title: "?기 세션 일기", meta: "Design" },
];

export default function PlanningDesignSession() {
  return (
    <div className="page-stack">
      <BackLink to="/intro" label="소개" />
      <PageHeader eyebrow="Session" title="기획&디자인 세션" />
      <PlaceholderPanel title="기획&디자인" />
      <LinkGrid items={items} />
    </div>
  );
}
