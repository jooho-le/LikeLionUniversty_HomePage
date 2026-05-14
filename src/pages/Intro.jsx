import { Link } from "react-router-dom";
import {
  CalendarDays,
  Code2,
  HelpCircle,
  Layers3,
  PenTool,
  Server,
  Sparkles,
  UsersRound,
} from "lucide-react";

const stats = [
  { value: "14TH", label: "전북대학교 기수" },
  { value: "3", label: "운영 트랙" },
  { value: "8W+", label: "기초 세션" },
  { value: "Demo", label: "프로젝트 발표" },
];

const timeline = [
  { period: "03월", title: "모집 & OT", desc: "서류, 면접, 오리엔테이션으로 14기 활동을 시작합니다." },
  { period: "04-06월", title: "트랙 세션", desc: "프론트엔드, 백엔드, 기획/디자인 기초를 집중적으로 학습합니다." },
  { period: "07-08월", title: "해커톤", desc: "짧은 기간 동안 팀으로 아이디어를 검증하고 프로토타입을 완성합니다." },
  { period: "09-11월", title: "팀 프로젝트", desc: "실제 사용자 문제를 정의하고 배포 가능한 서비스로 확장합니다." },
  { period: "12월", title: "데모데이", desc: "완성한 결과물을 발표하고 다음 성장을 위한 피드백을 나눕니다." },
];

const tracks = [
  {
    to: "/intro/frontend",
    icon: Code2,
    name: "프론트엔드",
    desc: "React 기반 UI, 반응형 화면, API 연동을 통해 사용자와 만나는 화면을 만듭니다.",
    skills: ["HTML/CSS", "JavaScript", "React"],
  },
  {
    to: "/intro/backend",
    icon: Server,
    name: "백엔드",
    desc: "API, 데이터베이스, 인증, 배포를 익히며 서비스의 안정적인 구조를 설계합니다.",
    skills: ["Python", "Django", "REST API"],
  },
  {
    to: "/intro/planning-design",
    icon: PenTool,
    name: "기획 · 디자인",
    desc: "문제 정의부터 프로토타입까지 서비스 방향과 사용자 경험을 구체화합니다.",
    skills: ["PRD", "Figma", "UX Research"],
  },
];

const projects = [
  { title: "캠퍼스 밥친구", tags: "#커뮤니티 #매칭", desc: "혼밥을 줄이고 캠퍼스 안 식사 메이트를 찾는 서비스" },
  { title: "중고책 마켓", tags: "#거래 #전공책", desc: "전공책 거래를 더 빠르고 안전하게 만드는 마켓" },
  { title: "스터디 로그", tags: "#학습 #루틴", desc: "팀 학습 기록과 목표 달성을 관리하는 대시보드" },
];

const faqs = [
  {
    q: "비전공자도 지원할 수 있나요?",
    a: "네. 경험보다 함께 배우고 완성하려는 태도를 중요하게 봅니다.",
  },
  {
    q: "포트폴리오가 꼭 필요한가요?",
    a: "필수는 아닙니다. 관심과 동기, 꾸준히 참여할 수 있는지를 중심으로 봅니다.",
  },
  {
    q: "활동은 얼마나 진행되나요?",
    a: "정규 세션, 해커톤, 팀 프로젝트, 데모데이까지 1년 흐름으로 운영됩니다.",
  },
];

function StatCard({ item }) {
  return (
    <article className="intro-stat-card">
      <strong>{item.value}</strong>
      <span>{item.label}</span>
    </article>
  );
}

function TrackCard({ item }) {
  const Icon = item.icon;

  return (
    <Link className="intro-track-card" to={item.to}>
      <span className="intro-icon" aria-hidden="true">
        <Icon size={22} strokeWidth={1.8} />
      </span>
      <h3>{item.name}</h3>
      <p>{item.desc}</p>
      <div>
        {item.skills.map((skill) => (
          <span className="intro-chip" key={skill}>{skill}</span>
        ))}
      </div>
    </Link>
  );
}

export default function Intro() {
  return (
    <div className="intro-page">
      <section className="intro-section intro-overview">
        <div className="section-heading">
          <span>Overview</span>
          <h2>전북대학교 멋쟁이사자처럼 14기 소개</h2>
        </div>
        <p>
          홈에서는 큰 방향을 보여주고, 이곳에서는 활동 방식과 연간 흐름, 트랙별 커리큘럼,
          프로젝트 예시를 자세히 살펴볼 수 있습니다.
        </p>
      </section>

      <section className="intro-stat-grid" aria-label="전북대 멋사 요약">
        {stats.map((item) => (
          <StatCard item={item} key={item.label} />
        ))}
      </section>

      <section className="intro-section two-column">
        <div className="section-heading">
          <span>About</span>
          <h2>세상을 넓혀가는 곳</h2>
        </div>
        <div className="intro-copy-card">
          <Sparkles size={22} strokeWidth={1.8} />
          <p>
            전북대학교 멋쟁이사자처럼은 개발, 기획, 디자인을 처음 시작하는 사람도
            자기만의 서비스를 만들 수 있도록 돕는 대학 IT 커뮤니티입니다.
          </p>
          <p>
            세션에서 기본기를 쌓고, 프로젝트에서 협업을 배우며, 결과물을 발표하면서
            실제 서비스 제작의 감각을 키웁니다.
          </p>
        </div>
      </section>

      <section className="intro-section">
        <div className="section-heading">
          <span>Timeline</span>
          <h2>연간 활동 일정</h2>
        </div>
        <div className="timeline-list">
          {timeline.map((item) => (
            <article className="timeline-row" key={item.period}>
              <strong>{item.period}</strong>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="intro-section">
        <div className="section-heading split-heading">
          <div>
            <span>Tracks</span>
            <h2>트랙 미리보기</h2>
          </div>
          <CalendarDays size={22} strokeWidth={1.8} />
        </div>
        <div className="intro-track-grid">
          {tracks.map((item) => (
            <TrackCard item={item} key={item.name} />
          ))}
        </div>
      </section>

      <section className="intro-section">
        <div className="section-heading">
          <span>Projects</span>
          <h2>프로젝트 미리보기</h2>
        </div>
        <div className="intro-project-grid">
          {projects.map((item, index) => (
            <article className="intro-project-card" key={item.title}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span>{item.tags}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="intro-section faq-preview">
        <div className="section-heading">
          <span>FAQ</span>
          <h2>자주 묻는 질문</h2>
        </div>
        <div className="faq-preview-list">
          {faqs.map((item) => (
            <article className="faq-preview-item" key={item.q}>
              <HelpCircle size={18} strokeWidth={1.8} />
              <div>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="intro-cta">
        <div>
          <span>Join Us</span>
          <h2>14기와 함께하세요</h2>
          <p>배우고 싶은 마음 하나로 충분합니다. 전북대학교 멋사에서 같이 만들어봐요.</p>
        </div>
        <Link className="hero-button primary" to="/apply">
          지원 페이지로 이동
          <Layers3 size={17} strokeWidth={1.8} />
        </Link>
      </section>
    </div>
  );
}
