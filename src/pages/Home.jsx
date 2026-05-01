import { useState } from "react";
import { Link } from "react-router-dom";
import { MacTrafficLights } from "../components/PageKit.jsx";

const quickLinks = [
  { to: "/intro", title: "ABOUT", caption: "소개" },
  { to: "/projects", title: "PROJECTS", caption: "프로젝트" },
  { to: "/profile", title: "MEMBERS", caption: "프로필" },
  { to: "/apply", title: "APPLY", caption: "신청" },
];

const activityCards = [
  { title: "동아리 소개", label: "ABOUT" },
  { title: "주요 활동", label: "ACTIVITY" },
  { title: "모집 파트", label: "PART" },
];

function StatusRow({ label, value, text, muted }) {
  return (
    <div className="status-row">
      <strong>{label}</strong>
      <span className="progress-meter" aria-hidden="true">
        <span style={{ width: value }} />
        {muted && <i />}
      </span>
      <em>{text}</em>
    </div>
  );
}

function ActivityCard({ item }) {
  const [isClosed, setIsClosed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (isClosed) {
    return (
      <button className="panel-restore mini-restore" type="button" onClick={() => setIsClosed(false)}>
        <MacTrafficLights />
        <span>{item.title}</span>
      </button>
    );
  }

  return (
    <article className={`info-card${isCollapsed ? " is-collapsed" : ""}${isZoomed ? " is-zoomed" : ""}`}>
      <span className="mini-card-bar">
        <MacTrafficLights
          interactive
          onClose={() => setIsClosed(true)}
          onMinimize={() => setIsCollapsed((value) => !value)}
          onZoom={() => setIsZoomed((value) => !value)}
          minimizeLabel={isCollapsed ? "펼치기" : "접기"}
          zoomLabel={isZoomed ? "축소" : "확대"}
        />
      </span>
      {!isCollapsed && (
        <Link className="info-card-content" to="/intro">
          <small>{item.label}</small>
          <strong>{item.title}</strong>
          <p>??</p>
        </Link>
      )}
    </article>
  );
}

function MissionPanel() {
  const [isClosed, setIsClosed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (isClosed) {
    return (
      <button className="panel-restore mission-restore" type="button" onClick={() => setIsClosed(false)}>
        <MacTrafficLights />
        <strong>MISSION LOG</strong>
        <span>다시 열기</span>
      </button>
    );
  }

  return (
    <div className={`hero-panel${isCollapsed ? " is-collapsed" : ""}${isZoomed ? " is-zoomed" : ""}`}>
      <div className="info-panel-header">
        <div className="window-title-group">
          <MacTrafficLights
            interactive
            onClose={() => setIsClosed(true)}
            onMinimize={() => setIsCollapsed((value) => !value)}
            onZoom={() => setIsZoomed((value) => !value)}
            minimizeLabel={isCollapsed ? "펼치기" : "접기"}
            zoomLabel={isZoomed ? "축소" : "확대"}
          />
          <span>MISSION LOG</span>
        </div>
        <strong>??</strong>
      </div>
      {!isCollapsed && (
        <div className="info-panel-body">
          {activityCards.map((item) => (
            <ActivityCard item={item} key={item.title} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span>&gt;</span> LIKELION × ?? UNIVERSITY × ?TH
          </p>
          <h1 className="hero-title">
            <span>BUILD</span>
            <span>YOUR</span>
            <span>WORLD</span>
          </h1>
          <p className="hero-subtitle">당신의 세계를 만드는 동아리</p>

          <div className="status-list" aria-label="동아리 상태">
            <StatusRow label="PASSION" value="100%" text="100%" />
            <StatusRow label="SKILL" value="50%" text="50%++" muted />
            <StatusRow label="NETWORK" value="100%" text="전국" />
          </div>

          <div className="hero-actions">
            <Link className="hero-button primary" to="/apply">
              <span>▶</span>
              지원하기
            </Link>
            <Link className="hero-button secondary" to="/intro">
              <span>▼</span>
              더 알아보기
            </Link>
          </div>
        </div>

        <MissionPanel />
      </section>

      <section className="quick-grid" aria-label="바로가기">
        {quickLinks.map((item) => (
          <Link className="quick-card" key={item.to} to={item.to}>
            <span>{item.title}</span>
            <strong>{item.caption}</strong>
            <small>??</small>
          </Link>
        ))}
      </section>
    </div>
  );
}
