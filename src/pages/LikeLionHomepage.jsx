import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function LikeLionHomepage() {
  return (
    <div className="page-stack">
      <BackLink to="/intro/about" label="멋사대학이란?" />
      <PageHeader eyebrow="Homepage" title="멋쟁이사자 홈페이지" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
