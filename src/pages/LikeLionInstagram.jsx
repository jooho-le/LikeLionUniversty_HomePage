import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function LikeLionInstagram() {
  return (
    <div className="page-stack">
      <BackLink to="/intro/about" label="멋사대학이란?" />
      <PageHeader eyebrow="Instagram" title="멋쟁이사자 인스타" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
