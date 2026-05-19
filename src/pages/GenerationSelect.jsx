import { BackLink, PageHeader } from "../components/PageKit.jsx";

const staffProfiles = [
  { name: "전진욱", role: "대표", track: "백엔드, 프론트엔드, 기획/디자인", detail: "컴퓨터인공지능학부", image: "/assets/members/jeon-jinuk.jpeg" },
  { name: "이주호", role: "운영진", track: "백엔드, 프론트엔드", detail: "기계설계공학부", image: "/assets/members/lee-jooho.png" },
  { name: "허재민", role: "운영진", track: "기획/디자인", detail: "컴퓨터인공지능학부" },
];

const memberProfiles = [
  { name: "김민령", role: "회원", track: "백엔드", detail: "컴퓨터인공지능학부" },
  { name: "박도현", role: "회원", track: "백엔드", detail: "소프트웨어공학부" },
  { name: "정세빈", role: "회원", track: "백엔드, 프론트엔드, 기획/디자인", detail: "컴퓨터공학부" },
  { name: "오성준", role: "회원", track: "백엔드, 프론트엔드", detail: "컴퓨터인공지능학부", image: "/assets/members/oh-sungjun.jpeg" },
  { name: "김지빈", role: "회원", track: "백엔드", detail: "컴퓨터인공지능학부", image: "/assets/members/kim-jibin.jpeg" },
  { name: "박소현", role: "회원", track: "기획/디자인", detail: "컴퓨터공학부" },
  { name: "박서정", role: "회원", track: "백엔드", detail: "산업정보시스템공학과" },
  { name: "최정우", role: "회원", track: "백엔드, 프론트엔드", detail: "수학과", image: "/assets/members/choi-jungwoo.jpeg" },
  { name: "전진표", role: "회원", track: "백엔드, 프론트엔드", detail: "컴퓨터인공지능학부", image: "/assets/members/jeon-jinpyo.jpeg" },
];

function MemberCard({ person }) {
  return (
    <article className="member-card">
      <div className="member-photo" aria-label={`${person.name} 프로필 사진`}>
        {person.image ? <img src={person.image} alt={`${person.name} 프로필`} /> : <span>{person.name}</span>}
      </div>
      <div className="member-info">
        <strong>{person.name}</strong>
        <span>{person.track}</span>
        <em>{person.detail}</em>
        <small>{person.role}</small>
      </div>
    </article>
  );
}

function MemberSection({ eyebrow, title, people }) {
  return (
    <section className="member-section">
      <div className="member-section-heading">
        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <p>전북대학교 멋쟁이사자처럼 14기 {title}입니다.</p>
      </div>
      <div className="member-grid">
        {people.map((person, index) => (
          <MemberCard person={person} key={`${title}-${person.name}-${index}`} />
        ))}
      </div>
    </section>
  );
}

export default function GenerationSelect() {
  return (
    <div className="member-page">
      <BackLink to="/profile" label="프로필" />
      <PageHeader
        eyebrow="Generation"
        title="14기 멤버"
        description="전북대 멋쟁이사자 14기의 운영진과 회원 아기사자들입니다."
      />
      <MemberSection eyebrow="Staff" people={staffProfiles} title="운영진" />
      <MemberSection eyebrow="Members" people={memberProfiles} title="회원" />
    </div>
  );
}
