import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMembers, getProjects, getSessions } from "../lib/api.js";

const fallbackStatus = {
  session: 14,
  members: 48,
  projects: 30,
  awards: 5,
};

// const homeLinks = [
//   { to: "/intro", label: "소개", sub: "About", icon: Info },
//   { to: "/projects", label: "프로젝트", sub: "Projects", icon: FolderKanban },
//   { to: "/profile", label: "멤버", sub: "Members", icon: UserRound },
//   { to: "/apply", label: "지원", sub: "Apply", icon: ClipboardList },
// ];

export default function Home() {
  const [status, setStatus] = useState(fallbackStatus);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([getSessions(), getMembers(), getProjects()]).then((results) => {
      if (!isMounted) return;

      setStatus((current) => ({
        ...current,
        session: results[0].status === "fulfilled" ? results[0].value.length : current.session,
        members: results[1].status === "fulfilled" ? results[1].value.length : current.members,
        projects: results[2].status === "fulfilled" ? results[2].value.length : current.projects,
      }));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
    <section className="file-home-hero" aria-label="전북대학교 멋쟁이사자처럼 홈 인트로">
      <div className="file-home-copy">
        <div className="file-hero-eyebrow">LIKELION × JBNU × 14TH</div>
        <h1 className="file-hero-title">
          <span>BUILD</span> YOUR
          <br />
          <em>WORLD</em>
        </h1>
        <p className="file-hero-slogan">
          <span>당신의 세계를</span> 만드는 동아리
        </p>

        <div className="hp-area" aria-label="활동 상태">
          <div className="hp-row">
            <span className="hp-lbl">PASSION</span>
            <span className="hp-bar">████████████████</span>
            <span className="hp-pct">100%</span>
          </div>
          <div className="hp-row">
            <span className="hp-lbl">SKILL</span>
            <span className="hp-bar">████████░░░░░░░░</span>
            <span className="hp-pct">50%→∞</span>
          </div>
          <div className="hp-row">
            <span className="hp-lbl">NETWORK</span>
            <span className="hp-bar">████████████████</span>
            <span className="hp-pct">전국</span>
          </div>
        </div>

        <div className="file-hero-actions">
          <Link className="pixel-button primary" to="/apply">
            ▶ 지원하기
          </Link>
          <Link className="pixel-button ghost" to="/intro">
            ▼ 더 알아보기
          </Link>
        </div>
      </div>

      <aside className="pixel-terminal" aria-label="전북대 멋사 현황 터미널">
        <div className="pixel-terminal-bar">
          <span className="tb red" />
          <span className="tb yellow" />
          <span className="tb green" />
          <strong>bash — likelion@jbnu</strong>
        </div>
        <div className="pixel-terminal-body">
          <p className="terminal-comment"># 전북대 멋사 현황</p>
          <p><span className="terminal-command">cat status.json</span></p>
          <code>{'{'}</code>
          <code>&nbsp;&nbsp;<span>"session"</span> : <b>{status.session}</b>,</code>
          <code>&nbsp;&nbsp;<span>"members"</span>: <b>{status.members}</b>,</code>
          <code>&nbsp;&nbsp;<span>"projects"</span>: <b>{status.projects}</b>,</code>
          <code>&nbsp;&nbsp;<span>"awards"</span> : <b>{status.awards}</b>,</code>
          <code>&nbsp;&nbsp;<span>"status"</span> : <em>"ACTIVE"</em></code>
          <code>{'}'}</code>
          <p><span className="terminal-command">git log --oneline -3</span></p>
          <code>🏆 a4f3c8b 해커톤 수상 ×2</code>
          <code>🚀 b92e1d4 데모데이 완료</code>
          <code>✅ c11a903 14기 모집 준비</code>
          <p><span className="terminal-caret" /></p>
        </div>
      </aside>
    </section>

    {/* <nav className="home-nav-grid" aria-label="주요 페이지 바로가기">
      {homeLinks.map(({ to, label, sub, icon: Icon }) => (
        <Link key={to} className="home-nav-card" to={to}>
          <Icon size={28} strokeWidth={1.6} />
          <strong>{label}</strong>
          <small>{sub}</small>
        </Link>
      ))}
    </nav> */}
    </>
  );
}
