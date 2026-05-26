import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { BackLink, MacTrafficLights, PageHeader } from "../components/PageKit.jsx";
import { getProject, getProjects } from "../lib/api.js";

const fallbackProjects = [
  {
    id: "example-1",
    title: "프로젝트 카드뉴스",
    description: "프로젝트 소개를 준비 중입니다.",
    tech_stack: "React, FastAPI",
    github_url: "",
    demo_url: "",
    thumbnail: "",
  },
];

function ProjectCardWindow({ project, index }) {
  const [isClosed, setIsClosed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (isClosed) {
    return (
      <button className="panel-restore card-news-restore" type="button" onClick={() => setIsClosed(false)}>
        <MacTrafficLights />
        <span>{project.title}</span>
      </button>
    );
  }

  return (
    <article className={`card-news-window${isCollapsed ? " is-collapsed" : ""}${isZoomed ? " is-zoomed" : ""}`}>
      <div className="card-window-bar">
        <MacTrafficLights
          interactive
          onClose={() => setIsClosed(true)}
          onMinimize={() => setIsCollapsed((value) => !value)}
          onZoom={() => setIsZoomed((value) => !value)}
          minimizeLabel={isCollapsed ? "펼치기" : "접기"}
          zoomLabel={isZoomed ? "축소" : "확대"}
        />
        <span>project-{index + 1}</span>
      </div>
      {!isCollapsed && (
        <div className="card-news-preview project-card-preview">
          <div className="project-card-media">
            {project.thumbnail ? <img src={project.thumbnail} alt={`${project.title} 썸네일`} /> : <span>Project</span>}
          </div>
          <span className="preview-badge">{project.tech_stack || "Tech Stack"}</span>
          <h2>{project.title}</h2>
          <p>{project.description || "프로젝트 설명을 준비 중입니다."}</p>
          <div className="project-card-actions">
            {project.github_url && (
              <a href={project.github_url} rel="noreferrer" target="_blank">
                GitHub
                <ExternalLink size={14} strokeWidth={1.8} />
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} rel="noreferrer" target="_blank">
                Demo
                <ExternalLink size={14} strokeWidth={1.8} />
              </a>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default function ProjectCardNews() {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    let isMounted = true;

    getProjects()
      .then(async (items) => {
        const detailedProjects = await Promise.all(items.map((item) => getProject(item.id)));
        if (!isMounted) return;
        setProjects(detailedProjects);
      })
      .catch(() => {
        if (!isMounted) return;
        setProjects(fallbackProjects);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page-stack">
      <BackLink to="/projects/generation" label="기수별 프로젝트" />
      <PageHeader
        eyebrow="Card News"
        title="프로젝트 카드뉴스"
        description="전북대학교 멋쟁이사자처럼의 프로젝트를 카드뉴스 형식으로 소개합니다."
      />
      <section className="card-news-grid" aria-label="프로젝트 카드뉴스">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <ProjectCardWindow index={index} project={project} key={project.id} />
          ))
        ) : (
          <p className="project-empty">등록된 프로젝트가 없습니다.</p>
        )}
      </section>
    </div>
  );
}
