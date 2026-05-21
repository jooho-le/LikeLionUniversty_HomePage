import { useState } from "react";
import { Link } from "react-router-dom";
import { Code2, PenTool, Server } from "lucide-react";

const tracks = [
  { icon: Code2, color: "var(--accent)", name: "프론트엔드", sub: "웹 화면 · UI 개발", slots: "~12명" },
  { icon: Server, color: "#d3457c", name: "백엔드", sub: "서버 · API · DB 개발", slots: "~12명" },
  { icon: PenTool, color: "#9b6fd4", name: "기획 · 디자인", sub: "PM / UI·UX Designer", slots: "~16명" },
];

const process = [
  { step: "01", title: "서류 접수", desc: "지원서 작성. 포트폴리오 불필요.", date: "03.03 – 03.14" },
  { step: "02", title: "서류 검토", desc: "의지와 이유 중심 평가.", date: "03.15 – 03.17" },
  { step: "03", title: "면접", desc: "15분 개인 면접. 기술 면접 없음.", date: "03.18 – 03.21" },
  { step: "04", title: "합격 발표", desc: "이메일 + 카카오톡 공지.", date: "03.24 (월)" },
  { step: "05", title: "OT 시작", desc: "팀빌딩, 첫 만남!", date: "03.28 (금)" },
];

const curriculum = {
  fe: [
    { week: "W01", title: "개발 환경 세팅", desc: "VS Code, Git/GitHub, Node.js 환경 구성" },
    { week: "W02", title: "HTML & CSS", desc: "시맨틱 마크업, Flexbox, Grid, 반응형" },
    { week: "W03", title: "JavaScript 기초", desc: "변수, 함수, 이벤트, DOM 조작" },
    { week: "W04", title: "JavaScript 심화", desc: "비동기, Fetch API, 모듈 시스템" },
    { week: "W05", title: "React 입문", desc: "컴포넌트, Props, State, Hooks" },
    { week: "W06", title: "React 심화", desc: "Context API, Router, 상태 관리" },
    { week: "W07", title: "API 연동", desc: "REST API, Axios, 백엔드 연동 실습" },
    { week: "W08+", title: "팀 프로젝트", desc: "기획 → 개발 → 배포 → 해커톤 → 데모데이" },
  ],
  be: [
    { week: "W01", title: "Python 기초", desc: "변수, 자료형, 조건문, 반복문" },
    { week: "W02", title: "Python 심화", desc: "클래스, 모듈, 파일 I/O" },
    { week: "W03", title: "Django 입문", desc: "MTV 패턴, URL, View, Template" },
    { week: "W04", title: "Database", desc: "ORM, Model, PostgreSQL" },
    { week: "W05", title: "REST API", desc: "DRF, Serializer, CRUD, JWT" },
    { week: "W06", title: "배포", desc: "AWS EC2, RDS, Nginx, Docker" },
    { week: "W07", title: "심화 주제", desc: "Celery, Redis, WebSocket" },
    { week: "W08+", title: "팀 프로젝트", desc: "API 설계 → 개발 → 배포 → 해커톤" },
  ],
  dp: [
    { week: "W01", title: "서비스 기획이란?", desc: "PM 역할, 문제 정의, 서비스 프로세스" },
    { week: "W02", title: "아이디어 발굴", desc: "고객 인터뷰, 페인포인트, 가설 설정" },
    { week: "W03", title: "사용자 리서치", desc: "퍼소나, 사용자 저니맵, FGI" },
    { week: "W04", title: "서비스 기획서", desc: "PRD 작성, 기능 정의, 우선순위" },
    { week: "W05", title: "Figma 기초", desc: "프레임, 컴포넌트, 스타일 레이아웃" },
    { week: "W06", title: "UI 원칙", desc: "타이포그래피, 색상, 8pt 그리드" },
    { week: "W07", title: "와이어프레임 → 프로토타입", desc: "로우파이 → 하이파이 흐름" },
    { week: "W08+", title: "팀 프로젝트", desc: "기획 → 디자인 → 개발 협업 → 데모데이" },
  ],
};

const tabList = [
  { key: "fe", label: "FRONTEND" },
  { key: "be", label: "BACKEND" },
  { key: "dp", label: "PLANNING / DESIGN" },
];

export default function Apply() {
  const [activeTab, setActiveTab] = useState("fe");

  return (
    <div className="apply-page">

      {/* Hero */}
      <section className="apply-hero">
        <div className="apply-hero-copy">
          <div className="file-hero-eyebrow">APPLY · 14TH</div>
          <h1 className="apply-title">
            <span>14기</span>를<br />모집합니다
          </h1>
          <p className="apply-desc">
            전공 불문, 경험 불문.<br />
            배우고 싶다는 의지 하나면 충분합니다.
          </p>
          <div className="apply-badges">
            <span className="apply-badge">사전지식 불필요</span>
            <span className="apply-badge">3개 트랙</span>
            <span className="apply-badge">3월 모집</span>
          </div>
          <div className="apply-hero-actions">
            <Link className="pixel-button primary" to="/apply/form">▶ 지원서 작성</Link>
          </div>
        </div>

        <div className="apply-track-list">
          <div className="apply-track-list-head"># 지원 트랙</div>
          {tracks.map(({ icon: Icon, color, name, sub, slots }) => (
            <div className="apply-track-row" key={name}>
              <Icon size={18} strokeWidth={1.8} style={{ color }} />
              <div>
                <strong>{name}</strong>
                <small>{sub}</small>
              </div>
              <span>{slots}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="apply-section">
        <div className="section-heading">
          <span>Process</span>
          <h2>지원 과정</h2>
        </div>
        <div className="apply-process">
          {process.map(({ step, title, desc, date }) => (
            <div className="apply-step" key={step}>
              <div className="apply-step-num">{step}</div>
              <strong>{title}</strong>
              <p>{desc}</p>
              <span className="apply-step-date">{date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section className="apply-section">
        <div className="section-heading">
          <span>Curriculum</span>
          <h2>트랙별 커리큘럼</h2>
        </div>
        <div className="apply-tabs">
          {tabList.map(({ key, label }) => (
            <button
              key={key}
              className={`apply-tab${activeTab === key ? " active" : ""}`}
              onClick={() => setActiveTab(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="apply-curr-grid">
          {curriculum[activeTab].map(({ week, title, desc }) => (
            <div className="apply-curr-item" key={week}>
              <div className="apply-curr-week">{week}</div>
              <div>
                <strong>{title}</strong>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
