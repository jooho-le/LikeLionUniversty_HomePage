import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "../data/projects.js";

const PREVIEW_COUNT = 3;

function PreviewCard({ project }) {
  const thumb = project.images?.[0];
  return (
    <div className="proj-card proj-card-static">
      <div className="proj-card-thumb">
        {thumb ? (
          <img src={thumb} alt={project.title} />
        ) : (
          <span>{project.title}</span>
        )}
      </div>
      <div className="proj-card-body">
        <h3 className="proj-card-title">{project.title}</h3>
        <p className="proj-card-desc">{project.subtitle}</p>
        <div className="proj-card-tags">
          <span className="proj-card-tag proj-card-tag--gen">{project.generation}</span>
          <span className="proj-card-tag proj-card-tag--event">{project.event}</span>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const preview = PROJECTS.slice(0, PREVIEW_COUNT);

  return (
    <div className="page-stack">
      <section className="proj-compact-header">
        <p className="eyebrow">Projects</p>
        <h1 className="proj-compact-title">프로젝트</h1>
        <p className="proj-compact-desc">
          멋쟁이사자처럼 전북대학교의 프로젝트 아카이브입니다. 총 {PROJECTS.length}개의 프로젝트가 있습니다.
        </p>
      </section>

      <section className="intro-section proj-archive">
        <div className="split-heading">
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <span>Recent</span>
            <h2>최근 프로젝트</h2>
          </div>
          <Link className="proj-more-link" to="/projects/generation">
            전체 보기
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>

        <div className="proj-grid">
          {preview.map((project) => (
            <PreviewCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
