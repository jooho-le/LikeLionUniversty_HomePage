import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Code2, Layers3, Mail, PenTool, Server } from "lucide-react";
import CurriculumSection from "../components/CurriculumSection";

function IconInstagram({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconKakao({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3C6.48 3 2 6.92 2 11.75c0 3.06 1.87 5.75 4.73 7.38l-.93 3.44a.4.4 0 0 0 .61.44l4.05-2.5c.49.06.99.09 1.54.09 5.52 0 10-3.92 10-8.75S17.52 3 12 3z" />
    </svg>
  );
}

const tracks = [
  { icon: Code2,   name: "프론트엔드",    sub: "웹 화면 · UI 개발" },
  { icon: Server,  name: "백엔드",        sub: "서버 · API · DB 개발" },
  { icon: PenTool, name: "기획 · 디자인", sub: "PM / UI·UX Designer" },
];

const process = [
  { step: "01", title: "서류 접수",  desc: "지원서 작성. 포트폴리오 불필요.",  date: "03.03 – 03.14" },
  { step: "02", title: "서류 검토",  desc: "의지와 이유 중심 평가.",            date: "03.15 – 03.17" },
  { step: "03", title: "면접",       desc: "15분 개인 면접. 기술 면접 없음.",   date: "03.18 – 03.21" },
  { step: "04", title: "합격 발표",  desc: "이메일 + 카카오톡 공지.",           date: "03.24 (월)"    },
  { step: "05", title: "OT 시작",    desc: "팀빌딩, 첫 만남!",                  date: "03.28 (금)"    },
];

const faqs = [
  {
    q: "코딩을 한 번도 안 해본 비전공자도 따라갈 수 있나요?",
    a: "네, 전공과 무관하게 누구나 지원 가능합니다. 커리큘럼은 완전 초보자도 따라올 수 있도록 기초부터 시작하며, 함께 성장하는 문화를 지향합니다.",
  },
  {
    q: "매주 활동 시간과 요일은 어떻게 되나요?",
    a: "세션은 주 1회 진행되며, 시간과 요일은 OT 이후 멤버 전체 일정을 조율해 확정합니다. 보통 평일 저녁 또는 주말 오전에 진행됩니다.",
  },
  {
    q: "시험 기간에도 세션이 진행되나요?",
    a: "중간·기말 시험 기간에는 세션을 쉬거나 온라인으로 대체합니다. 학업과 병행할 수 있도록 일정을 유연하게 운영합니다.",
  },
  {
    q: "트랙 선택은 어떻게 이루어지나요?",
    a: "지원서에서 희망 트랙을 선택하고, 면접 결과를 반영해 최종 배정됩니다. 면접에서 적합한 트랙으로 안내해 드리기도 합니다.",
  },
  {
    q: "활동 기간과 수료 조건이 어떻게 되나요?",
    a: "3월 OT부터 12월 데모데이까지 약 1년간 활동합니다. 해커톤, 팀 프로젝트, 데모데이에 모두 참여하면 전국 멋쟁이사자처럼 수료증이 발급됩니다.",
  },
];

const contacts = [
  { icon: IconInstagram, label: "Instagram",  handle: "@likelion_jbnu",     href: "#" },
  { icon: IconKakao,     label: "KakaoTalk",  handle: "오픈채팅으로 문의",   href: "#" },
  { icon: Mail,          label: "Email",      handle: "likelion@jbnu.ac.kr", href: "mailto:likelion@jbnu.ac.kr" },
];

export default function Apply() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showFloat, setShowFloat] = useState(false);
  const heroCtaRef  = useRef(null);
  const finalCtaRef = useRef(null);

  useEffect(() => {
    const panel = document.querySelector(".content-panel");
    if (!panel) return;
    const onScroll = () => {
      const heroEl  = heroCtaRef.current;
      const finalEl = finalCtaRef.current;
      if (!heroEl || !finalEl) return;
      const heroCTAGone  = heroEl.getBoundingClientRect().bottom < 0;
      const finalInView  = finalEl.getBoundingClientRect().top < panel.getBoundingClientRect().bottom;
      setShowFloat(heroCTAGone && !finalInView);
    };
    panel.addEventListener("scroll", onScroll);
    return () => panel.removeEventListener("scroll", onScroll);
  }, []);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="apply-page">

      {/* 1. Hero */}
      <section className="intro-section apply-overview">
        <div className="apply-blob apply-blob-1" aria-hidden="true" />
        <div className="apply-blob apply-blob-2" aria-hidden="true" />

        <div className="apply-hero-content">
          <p className="apply-hero-eyebrow">Apply · 14th</p>
          <h2 className="apply-hero-title">
            14기를<br />모집합니다
          </h2>
          <p className="apply-hero-desc">
            전공 불문, 경험 불문. 아이디어를 현실로 만드는 전북대학교 대형 IT 연합 동아리
            멋쟁이사자처럼에서 함께 성장할 14기 아기사자를 모집합니다.
          </p>
          <div className="apply-hero-meta">
            <span className="apply-hero-meta-item">
              <span className="apply-hero-meta-label">모집 대상</span>
              <span className="apply-hero-meta-sep" aria-hidden="true">|</span>
              <span className="apply-hero-meta-value">전북대학교 재학생 및 휴학생</span>
            </span>
            <span className="apply-hero-meta-item">
              <span className="apply-hero-meta-label">서류 마감</span>
              <span className="apply-hero-meta-sep" aria-hidden="true">|</span>
              <span className="apply-hero-meta-value apply-hero-meta-deadline">03.14 (금)</span>
            </span>
          </div>

          <div className="apply-track-grid">
            {tracks.map(({ icon: Icon, name, sub }) => (
              <div className="apply-track-card" key={name}>
                <span className="apply-track-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <div className="apply-track-text">
                  <strong>{name}</strong>
                  <span>{sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div ref={heroCtaRef}>
            <Link className="hero-button primary" to="/apply/form">
              지원서 작성하기
              <Layers3 size={17} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Process */}
      <section className="intro-section">
        <div className="section-heading">
          <span>Process</span>
          <h2>지원 과정</h2>
        </div>
        <div className="apply-process">
          {process.map(({ step, title, desc, date }) => (
            <div className="apply-step" key={step}>
              <span className="apply-step-num">{step}</span>
              <strong>{title}</strong>
              <p>{desc}</p>
              <time className="apply-step-date">{date}</time>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Curriculum */}
      <CurriculumSection />

      {/* 4. FAQ */}
      <section className="intro-section">
        <div className="section-heading">
          <span>FAQ</span>
          <h2>자주 묻는 질문</h2>
        </div>
        <div className="apply-faq-list">
          {faqs.map((item, i) => (
            <div className={`apply-faq-item${openFaq === i ? " open" : ""}`} key={item.q}>
              <button className="apply-faq-q" onClick={() => toggleFaq(i)} type="button">
                <span>{item.q}</span>
                <ChevronDown size={18} strokeWidth={1.8} className="apply-faq-chevron" />
              </button>
              <div className="apply-faq-a">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Final CTA + Contact */}
      <section ref={finalCtaRef} className="intro-cta apply-final-cta">
        <div>
          <span>Join Us</span>
          <h2>지금 바로 시작하세요</h2>
          <p>배우고 싶은 마음 하나로 충분합니다. 14기와 함께 만들어봐요.</p>
          <div className="apply-contact-row">
            {contacts.map(({ icon: Icon, label, handle, href }) => (
              <a className="apply-contact-chip" key={label} href={href} target="_blank" rel="noopener noreferrer">
                <Icon size={15} />
                <span>{handle}</span>
              </a>
            ))}
          </div>
        </div>
        <Link className="hero-button primary" to="/apply/form">
          지원서 작성하기
          <Layers3 size={17} strokeWidth={1.8} />
        </Link>
      </section>

      {/* Floating CTA — hero CTA 밖으로 나가고 final CTA 진입 전에만 표시 */}
      <Link
        className={`apply-float-btn${showFloat ? " visible" : ""}`}
        to="/apply/form"
        aria-hidden={!showFloat}
      >
        ▶ 지원하기
      </Link>

    </div>
  );
}
