import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, UsersRound } from "lucide-react";

const profileStats = [
  { value: "14TH", label: "현재 기수" },
  { value: "3", label: "운영 트랙" },
  { value: "??", label: "활동 멤버" },
];

export default function Profile() {
  return (
    <div className="profile-page">
      <section className="profile-hero-card">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>프로필</h1>
          <p>
            전북대학교 멋쟁이사자처럼 14기의 운영진과 회원을 한눈에 확인할 수 있는
            멤버 아카이브입니다.
          </p>
        </div>
        <span className="profile-hero-icon" aria-hidden="true">
          <UsersRound size={34} strokeWidth={1.8} />
        </span>
      </section>

      <section className="profile-stat-row" aria-label="프로필 요약">
        {profileStats.map((item) => (
          <article className="profile-stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <Link className="generation-entry-card" to="/profile/generation">
        <div className="generation-entry-copy">
          <span className="entry-icon">
            <CalendarDays size={22} strokeWidth={1.8} />
          </span>
          <div>
            <p className="eyebrow">Generation</p>
            <h2>14기 멤버 보기</h2>
            <p>운영진과 회원 프로필을 한 화면에서 확인합니다.</p>
          </div>
        </div>
        <ArrowRight size={28} strokeWidth={1.8} />
      </Link>
    </div>
  );
}
