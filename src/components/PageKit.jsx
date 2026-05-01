import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

export function MacTrafficLights({
  interactive = false,
  onClose,
  onMinimize,
  onZoom,
  closeLabel = "닫기",
  minimizeLabel = "접기",
  zoomLabel = "확대",
}) {
  if (interactive) {
    return (
      <span className="traffic-dots interactive">
        <button className="traffic-dot red" type="button" aria-label={closeLabel} onClick={onClose} />
        <button
          className="traffic-dot yellow"
          type="button"
          aria-label={minimizeLabel}
          onClick={onMinimize}
        />
        <button className="traffic-dot green" type="button" aria-label={zoomLabel} onClick={onZoom} />
      </span>
    );
  }

  return (
    <span className="traffic-dots" aria-hidden="true">
      <span className="traffic-dot red" />
      <span className="traffic-dot yellow" />
      <span className="traffic-dot green" />
    </span>
  );
}

function LinkedWindowCard({ to, title, meta, external }) {
  const [isClosed, setIsClosed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (isClosed) {
    return (
      <button className="panel-restore card-restore" type="button" onClick={() => setIsClosed(false)}>
        <MacTrafficLights />
        <span>{title}</span>
      </button>
    );
  }

  return (
    <article className={`page-card${isCollapsed ? " is-collapsed" : ""}${isZoomed ? " is-zoomed" : ""}`}>
      <div className="card-window-bar">
        <MacTrafficLights
          interactive
          onClose={() => setIsClosed(true)}
          onMinimize={() => setIsCollapsed((value) => !value)}
          onZoom={() => setIsZoomed((value) => !value)}
          minimizeLabel={isCollapsed ? "펼치기" : "접기"}
          zoomLabel={isZoomed ? "축소" : "확대"}
        />
        <span>{meta}</span>
      </div>
      {!isCollapsed && (
        <Link className="page-card-body" to={to}>
          <div>
            <span className="card-meta">{meta}</span>
            <h2>{title}</h2>
            <p>??</p>
          </div>
          {external ? <ExternalLink size={20} /> : <ArrowRight size={20} />}
        </Link>
      )}
    </article>
  );
}

export function PageHeader({ eyebrow, title }) {
  return (
    <section className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lead">??</p>
    </section>
  );
}

export function LinkGrid({ items }) {
  return (
    <div className="link-grid">
      {items.map(({ to, title, meta, external }) => (
        <LinkedWindowCard external={external} key={to} meta={meta} title={title} to={to} />
      ))}
    </div>
  );
}

export function PlaceholderPanel({ title = "??" }) {
  const [isClosed, setIsClosed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (isClosed) {
    return (
      <button className="panel-restore" type="button" onClick={() => setIsClosed(false)}>
        <MacTrafficLights />
        <span>{title}</span>
      </button>
    );
  }

  return (
    <section className={`placeholder-panel${isCollapsed ? " is-collapsed" : ""}${isZoomed ? " is-zoomed" : ""}`}>
      <div className="card-window-bar">
        <MacTrafficLights
          interactive
          onClose={() => setIsClosed(true)}
          onMinimize={() => setIsCollapsed((value) => !value)}
          onZoom={() => setIsZoomed((value) => !value)}
          minimizeLabel={isCollapsed ? "펼치기" : "접기"}
          zoomLabel={isZoomed ? "축소" : "확대"}
        />
        <span>{title}</span>
      </div>
      {!isCollapsed && (
        <div className="placeholder-body">
          <h2>{title}</h2>
          <p>??</p>
        </div>
      )}
    </section>
  );
}

export function BackLink({ to, label }) {
  return (
    <Link className="back-link" to={to}>
      <ArrowLeft size={16} />
      <span>{label}</span>
    </Link>
  );
}
