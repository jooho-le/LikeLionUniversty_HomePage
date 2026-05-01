import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function MemberProfile() {
  return (
    <div className="page-stack">
      <BackLink to="/profile/generation" label="기수 선택" />
      <PageHeader eyebrow="Members" title="?기 회원" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
