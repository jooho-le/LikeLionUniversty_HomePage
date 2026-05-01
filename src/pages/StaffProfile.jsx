import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function StaffProfile() {
  return (
    <div className="page-stack">
      <BackLink to="/profile/generation" label="기수 선택" />
      <PageHeader eyebrow="Staff" title="?기 운영진" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
