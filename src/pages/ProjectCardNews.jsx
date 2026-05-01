import { useState } from "react";
import { BackLink, MacTrafficLights, PageHeader } from "../components/PageKit.jsx";

const cardNewsItems = ["??", "??", "??"];

function CardNewsWindow({ item, index }) {
  const [isClosed, setIsClosed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (isClosed) {
    return (
      <button className="panel-restore card-news-restore" type="button" onClick={() => setIsClosed(false)}>
        <MacTrafficLights />
        <span>cardnews-{index + 1}</span>
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
        <span>cardnews-{index + 1}</span>
      </div>
      {!isCollapsed && (
        <div className="card-news-preview">
          <span className="preview-badge">??</span>
          <h2>{item}</h2>
          <p>??</p>
        </div>
      )}
    </article>
  );
}

export default function ProjectCardNews() {
  return (
    <div className="page-stack">
      <BackLink to="/projects/generation" label="기수별 프로젝트" />
      <PageHeader eyebrow="Card News" title="프로젝트 카드뉴스" />
      <section className="card-news-grid" aria-label="프로젝트 카드뉴스">
        {cardNewsItems.map((item, index) => (
          <CardNewsWindow index={index} item={item} key={`${item}-${index}`} />
        ))}
      </section>
    </div>
  );
}
