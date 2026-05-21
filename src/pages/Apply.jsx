import { LinkGrid, PageHeader } from "../components/PageKit.jsx";

const items = [
  { to: "/apply/faq", title: "FAQ", meta: "Apply" },
  { to: "/apply/form", title: "14기 신청하기", meta: "Apply" },
];

export default function Apply() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Apply"
        title="신청"
        description="자주 묻는 질문을 확인하고, 백엔드 지원 API로 신청서를 제출할 수 있습니다."
      />
      <LinkGrid items={items} />
    </div>
  );
}
