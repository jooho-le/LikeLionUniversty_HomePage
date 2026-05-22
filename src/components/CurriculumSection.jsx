import { useState } from "react";
import { ExternalLink } from "lucide-react";

const mainTabs = [
  { key: "dp", label: "기획/디자인" },
  { key: "fe", label: "프론트엔드 (React)" },
  { key: "be", label: "백엔드" },
];

const beSubTabs = [
  { key: "django", label: "Django 트랙" },
  { key: "spring", label: "Spring Boot 트랙" },
];

const officialLinks = {
  dp:     "https://likelion-pbl-five.vercel.app/design",
  fe:     "https://likelion-pbl-five.vercel.app/react",
  django: "https://likelion-pbl-five.vercel.app/django",
  spring: "https://likelion-pbl-five.vercel.app/springboot",
};

const curriculum = {
  dp: [
    { week: "W01", title: "IT 서비스 협업 구조 이해",              desc: "FE/BE/Design/PM 역할 분담과 서비스 흐름을 파악합니다." },
    { week: "W02", title: "Figma 입문 & 사용자 시나리오 보드",      desc: "Figma 기본 툴과 사용자 시나리오 보드를 제작합니다." },
    { week: "W03", title: "IA(정보 구조) 제작",                     desc: "서비스 정보 구조를 설계하고 기능을 분해합니다." },
    { week: "W04", title: "사용자 플로우 설계",                     desc: "사용자 이동 흐름과 예외 처리를 시나리오로 정리합니다." },
    { week: "W05", title: "컴포넌트 & Auto Layout",                 desc: "재사용 가능한 Figma 컴포넌트와 Auto Layout을 구성합니다." },
    { week: "W06", title: "와이어프레임 제작",                       desc: "실제 화면 구조를 와이어프레임으로 그리고 UX를 검증합니다." },
    { week: "W07", title: "기능 명세서 작성",                        desc: "화면과 기능을 매핑한 기능 명세서를 완성합니다." },
    { week: "W08", title: "디자인 시스템 기초",                      desc: "일관된 UI를 위한 디자인 시스템과 토큰을 구성합니다." },
    { week: "W09", title: "High-Fi UI 디자인 & UX 테스트",          desc: "완성도 높은 UI를 디자인하고 사용자 테스트를 진행합니다." },
    { week: "W10", title: "개발 협업을 위한 정리",                   desc: "Dev Mode와 Inspect 활용법으로 개발 협업을 마무리합니다." },
  ],
  fe: [
    { week: "W01", title: "HTML/CSS 기초",          desc: "웹 페이지의 구조와 기본 스타일링을 학습합니다." },
    { week: "W02", title: "CSS 레이아웃 & 반응형",   desc: "Flex와 Grid로 다양한 화면에 대응하는 레이아웃을 구성합니다." },
    { week: "W03", title: "JavaScript 기초",         desc: "DOM 조작과 이벤트 처리로 동적인 웹을 만듭니다." },
    { week: "W04", title: "JS 비동기와 데이터 처리", desc: "Fetch API와 비동기 패턴으로 서버 데이터를 다룹니다." },
    { week: "W05", title: "React 시작하기",          desc: "컴포넌트 기반 개발 방식과 JSX 문법을 배웁니다." },
    { week: "W06", title: "상태와 Effect",           desc: "useState와 useEffect로 컴포넌트 상태를 관리합니다." },
    { week: "W07", title: "라우팅 & 네비게이션",     desc: "React Router로 페이지 전환과 URL 관리를 구현합니다." },
    { week: "W08", title: "TypeScript 도입",         desc: "타입 시스템으로 더 안전하고 명확한 코드를 작성합니다." },
    { week: "W09", title: "API 연동 및 서버 통신",   desc: "Axios와 TanStack Query로 실제 API를 연동합니다." },
    { week: "W10", title: "웹 성능 최적화 및 배포",  desc: "Vercel로 배포하고 코드 스플리팅으로 성능을 개선합니다." },
  ],
  django: [
    { week: "W01", title: "Python 핵심 문법",      desc: "Python의 기본 문법과 제어 흐름을 익힙니다." },
    { week: "W02", title: "자료구조 & 로직 분리",   desc: "리스트, 딕셔너리와 로직 분리 원칙을 학습합니다." },
    { week: "W03", title: "Python 객체지향(OOP)",   desc: "클래스와 상속으로 객체지향 프로그래밍을 이해합니다." },
    { week: "W04", title: "Django & MTV",           desc: "Django 프레임워크와 MTV 패턴으로 웹 서비스를 시작합니다." },
    { week: "W05", title: "Template & Form",        desc: "HTML 템플릿과 Form으로 화면과 입력을 처리합니다." },
    { week: "W06", title: "CRUD 구현",              desc: "URL, View, Model을 연결해 CRUD 기능을 완성합니다." },
    { week: "W07", title: "Admin & 구조 정리",      desc: "Django Admin과 마이그레이션으로 모델을 관리합니다." },
    { week: "W08", title: "Django ORM 기초",        desc: "ORM과 QuerySet으로 데이터베이스를 조작합니다." },
    { week: "W09", title: "연관관계 & 트랜잭션",    desc: "ForeignKey로 모델 간 관계를 설계합니다." },
    { week: "W10", title: "미니 프로젝트 완성",      desc: "코드를 정리하고 문서화하여 미니 프로젝트를 마무리합니다." },
  ],
  spring: [
    { week: "W01", title: "Java 핵심 문법 & 흐름",                           desc: "Java의 기본 문법과 프로그램 흐름을 학습합니다." },
    { week: "W02", title: "객체지향 I — 클래스와 캡슐화",                     desc: "클래스와 메서드로 객체지향의 기초를 다집니다." },
    { week: "W03", title: "객체지향 II — 상속/다형성/추상화",                 desc: "상속과 인터페이스로 유연한 설계를 구현합니다." },
    { week: "W04", title: "Java Collections & 설계 확장",                    desc: "List와 Map으로 데이터를 효율적으로 관리합니다." },
    { week: "W05", title: "자바로 배우는 IoC/DI",                            desc: "IoC와 DI 개념으로 Spring의 핵심 원리를 이해합니다." },
    { week: "W06", title: "Spring Boot 전환",                                desc: "Spring Boot로 본격적인 웹 애플리케이션 개발을 시작합니다." },
    { week: "W07", title: "REST API 설계(CRUD)",                             desc: "REST 원칙에 따라 CRUD API를 설계하고 구현합니다." },
    { week: "W08", title: "JPA 기초 & 영속성 컨텍스트",                      desc: "JPA와 Entity로 데이터베이스를 객체로 다룹니다." },
    { week: "W09", title: "연관관계 & 트랜잭션",                              desc: "연관관계 매핑으로 데이터 무결성을 보장합니다." },
    { week: "W10", title: "미니 프로젝트: 예외 처리 & 프론트엔드 연동",       desc: "예외 처리를 통합하고 프론트엔드와 연동해 프로젝트를 완성합니다." },
  ],
};

export default function CurriculumSection() {
  const [activeTab, setActiveTab] = useState("dp");
  const [beSubTab, setBeSubTab] = useState("django");

  const currentKey = activeTab === "be" ? beSubTab : activeTab;
  const currentData = curriculum[currentKey];
  const currentLink = officialLinks[currentKey];

  return (
    <section className="intro-section">
      <div className="section-heading">
        <span>Curriculum</span>
        <h2>트랙별 커리큘럼</h2>
      </div>

      <div className="curr-tabs-wrap">
        <div className="curr-main-tabs">
          {mainTabs.map(({ key, label }) => (
            <button
              key={key}
              className={`curr-main-tab${activeTab === key ? " active" : ""}`}
              onClick={() => setActiveTab(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className={`curr-sub-tabs${activeTab === "be" ? " visible" : ""}`}>
          {beSubTabs.map(({ key, label }) => (
            <button
              key={key}
              className={`curr-sub-tab${beSubTab === key ? " active" : ""}`}
              onClick={() => setBeSubTab(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="curr-list-wrap">
        <div className="curr-list">
          {currentData.map(({ week, title, desc }) => (
            <div className="curr-list-item" key={week}>
              <span className="curr-list-week">{week}</span>
              <div className="curr-list-body">
                <strong className="curr-list-title">{title}</strong>
                <p className="curr-list-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <a
        className="curr-official-link"
        href={currentLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        공식 커리큘럼 상세 보기
        <ExternalLink size={15} strokeWidth={1.8} />
      </a>
    </section>
  );
}
