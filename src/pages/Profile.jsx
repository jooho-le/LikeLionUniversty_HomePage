import { LinkGrid, PageHeader } from "../components/PageKit.jsx";

const items = [{ to: "/profile/generation", title: "기수 선택", meta: "Profile" }];

export default function Profile() {
  return (
    <div className="page-stack">
      <PageHeader eyebrow="Profile" title="프로필" />
      <LinkGrid items={items} />
    </div>
  );
}
