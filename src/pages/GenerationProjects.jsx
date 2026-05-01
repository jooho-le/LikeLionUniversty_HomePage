import { BackLink, LinkGrid, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

const items = [{ to: "/projects/card-news", title: "프로젝트 카드뉴스", meta: "Project" }];

export default function GenerationProjects() {
  return (
    <div className="page-stack">
      <BackLink to="/projects" label="프로젝트" />
      <PageHeader eyebrow="Generation" title="기수별 프로젝트" />
      <PlaceholderPanel title="??기" />
      <LinkGrid items={items} />
    </div>
  );
}
