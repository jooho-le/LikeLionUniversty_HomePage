import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";
import { getProjects } from "../lib/api.js";

const fallbackProjects = [
  {
    id: "example-1",
    title: "프로젝트 예시",
    thumbnail: "",
    tech_stack: "React, FastAPI",
  },
];

function ProjectListCard({ project }) {
  return (
    <Link className="project-list-card" to="/projects/card-news">
      <div className="project-list-thumb">
        {project.thumbnail ? <img src={project.thumbnail} alt={`${project.title} 썸네일`} /> : <span>Project</span>}
      </div>
      <div className="project-list-body">
        <span className="eyebrow">Project</span>
        <h2>{project.title}</h2>
        <p>{project.tech_stack || "기술 스택 준비 중"}</p>
      </div>
      <ArrowRight size={22} strokeWidth={1.8} />
    </Link>
  );
}

export default function GenerationProjects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [loadMessage, setLoadMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    getProjects()
      .then((items) => {
        if (!isMounted) return;
        setProjects(items);
        setLoadMessage("");
      })
      .catch(() => {
        if (!isMounted) return;
        setProjects(fallbackProjects);
        setLoadMessage("백엔드 API 연결 전이라 예시 프로젝트를 보여주고 있습니다.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page-stack">
      <BackLink to="/projects" label="프로젝트" />
      <PageHeader
        eyebrow="Generation"
        title="기수별 프로젝트"
        description="백엔드에 등록된 프로젝트 목록을 최신순으로 보여줍니다."
      />
      <PlaceholderPanel
        title="14기 프로젝트"
        description="프로젝트 제목, 썸네일, 기술 스택은 백엔드 프로젝트 API에서 불러옵니다."
      />
      {loadMessage && <p className="session-api-message">{loadMessage}</p>}
      <section className="project-list-grid" aria-label="프로젝트 목록">
        {projects.length > 0 ? (
          projects.map((project) => <ProjectListCard key={project.id} project={project} />)
        ) : (
          <p className="project-empty">등록된 프로젝트가 없습니다.</p>
        )}
      </section>
    </div>
  );
}
