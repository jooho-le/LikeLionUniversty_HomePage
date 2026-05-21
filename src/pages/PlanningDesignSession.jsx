import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function PlanningDesignSession() {
  return (
    <div className="page-stack">
      <BackLink to="/intro" label="소개" />
      <PageHeader
        eyebrow="Session"
        title="기획&디자인 세션"
        description="아이디어를 사용자 문제, 서비스 흐름, 화면 설계로 구체화하는 트랙입니다."
      />
      <PlaceholderPanel
        title="기획&디자인"
        description="문제 정의부터 와이어프레임, Figma 프로토타입까지 서비스 제작 전 과정을 설계합니다."
        points={[
          "사용자 리서치와 문제 정의",
          "정보 구조, 유저 플로우, 화면 설계",
          "Figma 기반 프로토타입과 디자인 시스템",
        ]}
      />
    </div>
  );
}
