import { BackLink, LinkGrid, PageHeader } from "../components/PageKit.jsx";

const items = [
  { to: "/profile/staff", title: "?기 운영진", meta: "Profile" },
  { to: "/profile/members", title: "?기 회원", meta: "Profile" },
];

export default function GenerationSelect() {
  return (
    <div className="page-stack">
      <BackLink to="/profile" label="프로필" />
      <PageHeader eyebrow="Generation" title="기수 선택" />
      <LinkGrid items={items} />
    </div>
  );
}
