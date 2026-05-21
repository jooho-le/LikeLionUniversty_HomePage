import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function BackendSession() {
  return (
    <div className="page-stack">
      <BackLink to="/intro" label="소개" />
      <PageHeader
        eyebrow="Session"
        title="백엔드 세션"
        description="서비스의 데이터, API, 인증, 배포 흐름을 설계하는 트랙입니다."
      />
      <PlaceholderPanel
        title="백엔드"
        description="서버와 데이터베이스의 기본기를 익히고, 프론트엔드가 사용할 수 있는 API를 직접 설계합니다."
        points={[
          "Python/Django 기반 서버 구현",
          "데이터베이스 모델링과 REST API 설계",
          "인증, 배포, 협업 흐름 이해",
        ]}
      />
    </div>
  );
}
