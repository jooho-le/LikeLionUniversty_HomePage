import { BackLink, LinkGrid, PageHeader, PlaceholderPanel } from "../components/PageKit.jsx";

const aboutItems = [
  { to: "/intro/about/instagram", title: "멋쟁이사자 인스타", meta: "Link", external: true },
  { to: "/intro/about/homepage", title: "멋쟁이사자 홈페이지", meta: "Link", external: true },
  { to: "/intro/about/pbl", title: "멋쟁이사자 PBL", meta: "Link", external: true },
];

export default function AboutLikeLion() {
  return (
    <div className="page-stack">
      <BackLink to="/intro" label="소개" />
      <PageHeader eyebrow="About" title="멋사대학이란?" />
      <PlaceholderPanel title="멋사대학" />
      <LinkGrid items={aboutItems} />
    </div>
  );
}
