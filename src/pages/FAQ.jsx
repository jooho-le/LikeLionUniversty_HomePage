import { BackLink, PageHeader } from "../components/PageKit.jsx";

const faqs = ["??", "??", "??"];

export default function FAQ() {
  return (
    <div className="page-stack">
      <BackLink to="/apply" label="신청" />
      <PageHeader eyebrow="FAQ" title="FAQ" />
      <div className="faq-list">
        {faqs.map((item, index) => (
          <article className="faq-item" key={`${item}-${index}`}>
            <h2>Q{index + 1}. {item}</h2>
            <p>??</p>
          </article>
        ))}
      </div>
    </div>
  );
}
