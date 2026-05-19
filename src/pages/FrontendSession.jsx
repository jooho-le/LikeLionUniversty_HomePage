import { BackLink, LinkGrid, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

const items = [
  { to: "/intro/frontend/content", title: "세션 내용", meta: "Frontend" },
  { to: "/intro/frontend/diary", title: "14기 세션 일기", meta: "Frontend" },
];

export default function FrontendSession() {
  return (
    <div className="page-stack">
      <BackLink to="/intro" label="소개" />
      <PageHeader eyebrow="Session" title="프론트엔드 세션" />
      <PlaceholderPanel
        title="프론트엔드"
        description="사용자가 직접 마주하는 화면을 설계하고 구현하는 트랙입니다. HTML/CSS 기초부터 JavaScript, React 컴포넌트, API 연동까지 단계적으로 학습합니다."
        points={[
          "반응형 레이아웃과 인터랙션 구현",
          "React 기반 컴포넌트 설계",
          "백엔드 API와 연결되는 서비스 화면 제작",
        ]}
      />
      <LinkGrid items={items} />
    </div>
  );
}
