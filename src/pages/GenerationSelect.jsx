import { useEffect, useMemo, useState } from "react";
import { BackLink, PageHeader } from "../components/PageKit.jsx";
import { getMembers } from "../lib/api.js";

const staffProfiles = [
  { name: "전진욱", role: "대표", track: "백엔드, 프론트엔드, 기획/디자인", detail: "컴퓨터인공지능학부", image: "/assets/members/jeon-jinuk.jpeg" },
  { name: "이주호", role: "운영진", track: "백엔드, 프론트엔드", detail: "기계설계공학부", image: "/assets/members/lee-jooho.png" },
  { name: "허재민", role: "운영진", track: "기획/디자인", detail: "컴퓨터인공지능학부" },
];

const memberProfiles = [
  { name: "김민령", role: "회원", track: "백엔드", detail: "컴퓨터인공지능학부", image: "/assets/members/kim-minrung.jpeg" },
  { name: "박도현", role: "회원", track: "백엔드", detail: "소프트웨어공학부" },
  { name: "정세빈", role: "회원", track: "백엔드, 프론트엔드, 기획/디자인", detail: "컴퓨터공학부" },
  { name: "오성준", role: "회원", track: "백엔드, 프론트엔드", detail: "컴퓨터인공지능학부", image: "/assets/members/oh-sungjun.jpeg" },
  { name: "김지빈", role: "회원", track: "백엔드", detail: "컴퓨터인공지능학부", image: "/assets/members/kim-jibin.jpeg" },
  { name: "박소현", role: "회원", track: "백엔드", detail: "컴퓨터공학부" },
  { name: "박서정", role: "회원", track: "기획/디자인", detail: "산업정보시스템공학과" },
  { name: "최정우", role: "회원", track: "백엔드, 프론트엔드", detail: "수학과", image: "/assets/members/choi-jungwoo.jpeg" },
  { name: "전진표", role: "회원", track: "백엔드, 프론트엔드", detail: "컴퓨터인공지능학부", image: "/assets/members/jeon-jinpyo.jpeg" },
];

function isStaffRole(role = "") {
  return /대표|운영진|staff/i.test(role);
}

function mapApiMember(member) {
  const roleLabel = member.role_label ?? "회원";

  return {
    id: member.id,
    name: member.name,
    role: isStaffRole(roleLabel) ? roleLabel : "회원",
    track: roleLabel,
    detail: member.joined_year ? `${member.joined_year}년 가입` : "전북대학교 멋쟁이사자처럼",
    image: member.profile_image,
    github: member.github_url,
  };
}

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
        {people.length > 0 ? (
          people.map((person, index) => (
            <MemberCard person={person} key={`${title}-${person.id ?? person.name}-${index}`} />
          ))
        ) : (
          <p className="member-empty">등록된 {title} 데이터가 없습니다.</p>
        )}
      </div>
    </section>
  );
}

export default function GenerationSelect() {
  const [apiMembers, setApiMembers] = useState(null);
  const [loadMessage, setLoadMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    getMembers()
      .then((members) => {
        if (!isMounted) return;
        setApiMembers(members.map(mapApiMember));
        setLoadMessage("");
      })
      .catch(() => {
        if (!isMounted) return;
        setApiMembers(null);
        setLoadMessage("백엔드 API 연결 전이라 로컬 예시 멤버를 보여주고 있습니다.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const { staff, members } = useMemo(() => {
    if (!apiMembers) {
      return { staff: staffProfiles, members: memberProfiles };
    }

    return {
      staff: apiMembers.filter((person) => isStaffRole(person.role)),
      members: apiMembers.filter((person) => !isStaffRole(person.role)),
    };
  }, [apiMembers]);

  return (
    <div className="member-page">
      <BackLink to="/profile" label="프로필" />
      <PageHeader
        eyebrow="Generation"
        title="14기 멤버"
        description="전북대 멋쟁이사자 14기의 운영진과 회원 아기사자들입니다."
      />
      {loadMessage && <p className="session-api-message">{loadMessage}</p>}
      <MemberSection eyebrow="Staff" people={staff} title="운영진" />
      <MemberSection eyebrow="Members" people={members} title="회원" />
    </div>
  );
}
