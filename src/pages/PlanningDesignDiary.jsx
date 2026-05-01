import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function PlanningDesignDiary() {
  return (
    <div className="page-stack">
      <BackLink to="/intro/planning-design" label="기획&디자인 세션" />
      <PageHeader eyebrow="Design" title="?기 세션 일기" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
