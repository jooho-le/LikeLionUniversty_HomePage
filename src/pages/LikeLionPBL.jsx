import { BackLink, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

export default function LikeLionPBL() {
  return (
    <div className="page-stack">
      <BackLink to="/intro/about" label="멋사대학이란?" />
      <PageHeader eyebrow="PBL" title="멋쟁이사자 PBL" />
      <PlaceholderPanel title="??" />
    </div>
  );
}
