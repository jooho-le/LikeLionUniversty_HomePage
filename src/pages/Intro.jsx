import { LinkGrid, PageHeader } from "../components/PageKit.jsx";

const introItems = [
  { to: "/intro/about", title: "멋사대학이란?", meta: "소개" },
  { to: "/intro/backend", title: "백엔드 세션", meta: "세션" },
  { to: "/intro/frontend", title: "프론트엔드 세션", meta: "세션" },
  { to: "/intro/planning-design", title: "기획&디자인 세션", meta: "세션" },
];

export default function Intro() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Intro" title="소개" />
      <LinkGrid items={introItems} />
    </div>
  );
}
