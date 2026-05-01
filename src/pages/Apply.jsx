import { LinkGrid, PageHeader } from "../components/PageKit.jsx";

const items = [
  { to: "/apply/faq", title: "FAQ", meta: "Apply" },
  { to: "/apply/form", title: "?기 신청하기", meta: "Apply" },
];

export default function Apply() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Apply" title="신청" />
      <LinkGrid items={items} />
    </div>
  );
}
