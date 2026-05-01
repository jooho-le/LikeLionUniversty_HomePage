import { LinkGrid, PageHeader } from "../components/PageKit.jsx";

const items = [{ to: "/projects/generation", title: "기수별 프로젝트", meta: "Project" }];

export default function Projects() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Projects" title="프로젝트" />
      <LinkGrid items={items} />
    </div>
  );
}
