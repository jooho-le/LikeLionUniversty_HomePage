import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Code2, PenTool, Plus, Server } from "lucide-react";
import TrackBoard from "../components/TrackBoard.jsx";
import {
  createDiary,
  getDiaries,
  getSessions,
  getStoredAccessToken,
  isAuthenticated,
  subscribeAuthChange,
} from "../lib/api.js";

const tracks = [
  {
    id: "frontend",
    label: "프론트엔드",
    english: "Frontend",
    icon: Code2,
    description: "React, UI 구조, 반응형 화면, API 연동 세션과 일기를 모아둡니다.",
  },
  {
    id: "backend",
    label: "백엔드",
    english: "Backend",
    icon: Server,
    description: "서버, 데이터베이스, 인증, 배포 세션과 일기를 모아둡니다.",
  },
  {
    id: "design",
    label: "기획/디자인",
    english: "Planning & Design",
    icon: PenTool,
    description: "문제 정의, 화면 설계, Figma 프로토타입 세션과 일기를 모아둡니다.",
  },
];

const fallbackPosts = {
  frontend: [
    {
      id: "frontend-content-example",
      type: "content",
      title: "프론트엔드 세션 내용 예시",
      summary: "React 기반 UI 구조와 컴포넌트 설계 흐름을 정리한 세션 자료입니다.",
      week: "세션",
      date: "예시",
      tags: ["Frontend", "React"],
    },
    {
      id: "frontend-diary-example",
      type: "diary",
      title: "프론트엔드 세션 일기 예시",
      summary: "첫 화면을 만들고 팀원들과 리뷰한 내용을 기록합니다.",
      week: "일기",
      date: "예시",
      tags: ["Frontend", "Diary"],
    },
  ],
  backend: [
    {
      id: "backend-content-example",
      type: "content",
      title: "백엔드 세션 내용 예시",
      summary: "API, 데이터베이스, 인증 흐름을 다룬 백엔드 세션 자료 예시입니다.",
      week: "세션",
      date: "예시",
      tags: ["Backend", "API"],
    },
    {
      id: "backend-diary-example",
      type: "diary",
      title: "백엔드 세션 일기 예시",
      summary: "서버 요청과 응답 흐름을 실습하며 배운 점을 기록합니다.",
      week: "일기",
      date: "예시",
      tags: ["Backend", "Diary"],
    },
  ],
  design: [
    {
      id: "design-content-example",
      type: "content",
      title: "기획/디자인 세션 내용 예시",
      summary: "문제 정의부터 와이어프레임, 프로토타입까지의 흐름을 정리한 자료입니다.",
      week: "세션",
      date: "예시",
      tags: ["Design", "Figma"],
    },
    {
      id: "design-diary-example",
      type: "diary",
      title: "기획/디자인 세션 일기 예시",
      summary: "사용자 문제를 찾고 화면 흐름으로 바꿔본 과정을 기록합니다.",
      week: "일기",
      date: "예시",
      tags: ["Design", "Diary"],
    },
  ],
};

function formatDate(value) {
  if (!value) return "날짜 미정";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 미정";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function trimSummary(value) {
  if (!value) return "내용을 준비 중입니다.";
  return value.length > 86 ? `${value.slice(0, 86)}...` : value;
}

function mapSessionToPost(session, track) {
  return {
    id: `session-${session.id}`,
    type: "content",
    title: session.title,
    summary: trimSummary(session.description),
    week: "세션",
    date: formatDate(session.session_date ?? session.created_at),
    tags: [track.english, session.presenter, session.material_url ? "자료" : null].filter(Boolean),
  };
}

function mapDiaryToPost(diary, track) {
  return {
    id: `diary-${diary.id}`,
    type: "diary",
    title: diary.title,
    summary: trimSummary(diary.content),
    week: "일기",
    date: formatDate(diary.created_at),
    tags: [track.english, `작성자 ${diary.author_id}`],
  };
}

export default function Session() {
  const [activeTrackId, setActiveTrackId] = useState(tracks[0].id);
  const [posts, setPosts] = useState(fallbackPosts[tracks[0].id]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [hasToken, setHasToken] = useState(isAuthenticated());

  const activeTrack = useMemo(
    () => tracks.find((track) => track.id === activeTrackId) ?? tracks[0],
    [activeTrackId],
  );
  const ActiveTrackIcon = activeTrack.icon;

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const [sessions, diaries] = await Promise.all([
        getSessions(activeTrack.id),
        getDiaries(activeTrack.id),
      ]);
      setPosts([
        ...sessions.map((session) => mapSessionToPost(session, activeTrack)),
        ...diaries.map((diary) => mapDiaryToPost(diary, activeTrack)),
      ]);
    } catch (error) {
      setPosts(fallbackPosts[activeTrack.id]);
      setLoadError("백엔드 API 연결 전이라 예시 게시글을 보여주고 있습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTrack]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => subscribeAuthChange(setHasToken), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = getStoredAccessToken();

    if (!token) {
      setFormStatus({ type: "error", message: "글 작성은 로그인 후 가능합니다." });
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setFormStatus({ type: "error", message: "제목과 내용을 모두 입력해주세요." });
      return;
    }

    setFormStatus({ type: "loading", message: "글을 등록하는 중입니다." });

    try {
      await createDiary({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: activeTrack.id,
        token,
      });
      setFormData({ title: "", content: "" });
      setFormStatus({ type: "success", message: `${activeTrack.label} 게시판에 글을 등록했습니다.` });
      await loadPosts();
    } catch (error) {
      setFormStatus({ type: "error", message: error.message });
    }
  };

  return (
    <div className="session-page">
      <section className="session-hero">
        <div>
          <span className="eyebrow">Session</span>
          <h1>세션 게시판</h1>
          <p>
            백엔드, 프론트엔드, 기획/디자인 트랙별로 세션 자료와 세션 일기를 나눠서 볼 수 있습니다.
            로그인한 승인 회원은 선택한 트랙에 바로 글을 작성할 수 있습니다.
          </p>
        </div>
        <div className="session-hero-card" aria-label="현재 선택된 세션 트랙">
          <BookOpenCheck size={26} strokeWidth={1.8} />
          <span>Selected Track</span>
          <strong>{activeTrack.label}</strong>
          <small>{activeTrack.english}</small>
        </div>
      </section>

      <section className="generation-filter-panel" aria-label="트랙 선택">
        <div className="generation-filter-head">
          <ActiveTrackIcon size={20} strokeWidth={1.8} />
          <div>
            <strong>트랙 선택</strong>
            <span>{activeTrack.description}</span>
          </div>
        </div>
        <div className="generation-tab-list session-track-tabs">
          {tracks.map((track) => {
            const Icon = track.icon;

            return (
              <button
                className={`generation-tab${track.id === activeTrack.id ? " is-active" : ""}`}
                key={track.id}
                type="button"
                onClick={() => {
                  setActiveTrackId(track.id);
                  setFormStatus({ type: "", message: "" });
                }}
              >
                <Icon size={18} strokeWidth={1.8} />
                <strong>{track.label}</strong>
                <span>{track.english}</span>
              </button>
            );
          })}
        </div>
      </section>

      <form className="session-compose-panel" onSubmit={handleSubmit}>
        <div className="session-compose-head">
          <div>
            <span className="eyebrow">Write</span>
            <h2>{activeTrack.label} 글 작성</h2>
            <p>작성한 글은 세션 일기 분류로 등록됩니다.</p>
          </div>
          <span className={`session-auth-badge${hasToken ? " is-logged-in" : ""}`}>
            {hasToken ? "로그인 완료" : "좌측 로그인 후 작성 가능"}
          </span>
        </div>
        <label>
          <span>제목</span>
          <input
            type="text"
            placeholder={`${activeTrack.label} 세션 일기 제목`}
            value={formData.title}
            onChange={(event) => setFormData((value) => ({ ...value, title: event.target.value }))}
          />
        </label>
        <label>
          <span>내용</span>
          <textarea
            placeholder="세션에서 배운 내용, 느낀 점, 공유하고 싶은 내용을 작성해주세요."
            rows={6}
            value={formData.content}
            onChange={(event) => setFormData((value) => ({ ...value, content: event.target.value }))}
          />
        </label>
        <div className="session-compose-actions">
          {formStatus.message && (
            <p className={`session-form-message ${formStatus.type}`}>{formStatus.message}</p>
          )}
          <button type="submit" disabled={formStatus.type === "loading" || !hasToken}>
            <Plus size={17} strokeWidth={1.8} />
            <span>글 등록</span>
          </button>
        </div>
      </form>

      {loadError && <p className="session-api-message">{loadError}</p>}

      <TrackBoard
        key={activeTrack.id}
        title={`${activeTrack.label} 세션 게시판`}
        description={isLoading ? "게시글을 불러오는 중입니다." : "세션 내용과 세션 일기를 분류 탭과 검색으로 확인할 수 있습니다."}
        posts={posts}
      />
    </div>
  );
}
