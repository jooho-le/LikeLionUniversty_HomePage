import { useMemo, useState } from "react";
import { BookOpenCheck, CalendarDays } from "lucide-react";
import TrackBoard from "../components/TrackBoard.jsx";

const generations = [
  {
    id: "14",
    label: "14기",
    period: "2026",
    description: "전북대학교 멋쟁이사자처럼 14기 세션 자료와 활동 일기를 모아두는 게시판입니다.",
    posts: [
      {
        id: "14-content-example",
        type: "content",
        title: "프론트엔드 세션 내용 예시",
        summary: "React 기반 UI 구조와 컴포넌트 설계 흐름을 정리한 세션 자료입니다.",
        week: "1주차",
        date: "2026.04",
        tags: ["14기", "Frontend", "React"],
      },
      {
        id: "14-diary-example",
        type: "diary",
        title: "14기 세션 일기 예시",
        summary: "첫 세션에서 배운 내용과 팀원들이 남긴 활동 기록을 정리합니다.",
        week: "기록",
        date: "2026.04",
        tags: ["14기", "Diary"],
      },
    ],
  },
  {
    id: "13",
    label: "13기",
    period: "2025",
    description: "이전 기수의 세션 자료와 활동 기록을 분리해서 확인할 수 있습니다.",
    posts: [
      {
        id: "13-content-example",
        type: "content",
        title: "백엔드 세션 내용 예시",
        summary: "API, 데이터베이스, 인증 흐름을 다룬 백엔드 세션 자료 예시입니다.",
        week: "1주차",
        date: "2025.04",
        tags: ["13기", "Backend", "API"],
      },
      {
        id: "13-diary-example",
        type: "diary",
        title: "13기 세션 일기 예시",
        summary: "세션을 진행하며 배운 점과 프로젝트 준비 과정을 남긴 기록입니다.",
        week: "기록",
        date: "2025.05",
        tags: ["13기", "Diary"],
      },
    ],
  },
];

export default function Session() {
  const [activeGenerationId, setActiveGenerationId] = useState(generations[0].id);
  const activeGeneration = useMemo(
    () => generations.find((generation) => generation.id === activeGenerationId) ?? generations[0],
    [activeGenerationId],
  );

  return (
    <div className="session-page">
      <section className="session-hero">
        <div>
          <span className="eyebrow">Session</span>
          <h1>세션 게시판</h1>
          <p>
            세션 내용과 기수별 세션 일기를 한 곳에서 볼 수 있도록 분리했습니다.
            기수를 선택하면 해당 기수의 게시글만 보여집니다.
          </p>
        </div>
        <div className="session-hero-card" aria-label="현재 선택된 세션 기수">
          <BookOpenCheck size={26} strokeWidth={1.8} />
          <span>Selected</span>
          <strong>{activeGeneration.label}</strong>
          <small>{activeGeneration.period}</small>
        </div>
      </section>

      <section className="generation-filter-panel" aria-label="기수 선택">
        <div className="generation-filter-head">
          <CalendarDays size={20} strokeWidth={1.8} />
          <div>
            <strong>기수 선택</strong>
            <span>{activeGeneration.description}</span>
          </div>
        </div>
        <div className="generation-tab-list">
          {generations.map((generation) => (
            <button
              className={`generation-tab${generation.id === activeGeneration.id ? " is-active" : ""}`}
              key={generation.id}
              type="button"
              onClick={() => setActiveGenerationId(generation.id)}
            >
              <strong>{generation.label}</strong>
              <span>{generation.period}</span>
            </button>
          ))}
        </div>
      </section>

      <TrackBoard
        key={activeGeneration.id}
        title={`${activeGeneration.label} 세션 게시판`}
        description="분류 탭과 검색을 사용해서 세션 내용과 세션 일기를 빠르게 찾을 수 있습니다."
        posts={activeGeneration.posts}
      />
    </div>
  );
}
