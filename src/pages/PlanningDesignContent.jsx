import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function PlanningDesignContent() {
  return (
    <div className="page-stack">
      <BackLink to="/intro/planning-design" label="기획&디자인 세션" />
      <PageHeader eyebrow="Planning" title="세션 내용" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
