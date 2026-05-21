import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpenText,
  ClipboardList,
  FolderKanban,
  Home,
  Info,
  LogIn,
  Search,
  UserRound,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Home", ko: "홈", icon: Home },
  { to: "/intro", label: "About", ko: "소개", icon: Info },
  { to: "/session", label: "Session", ko: "세션", icon: BookOpenText },
  { to: "/projects", label: "Projects", ko: "프로젝트", icon: FolderKanban },
  { to: "/profile", label: "Members", ko: "멤버", icon: UserRound },
  { to: "/apply", label: "Apply", ko: "지원", icon: ClipboardList },
  { to: "/login", label: "Login", ko: "로그인", icon: LogIn },
];

const routeTitles = [
  { prefix: "/admin", title: "관리자" },
  { prefix: "/intro", title: "소개" },
  { prefix: "/session", title: "세션" },
  { prefix: "/projects", title: "프로젝트" },
  { prefix: "/profile", title: "멤버" },
  { prefix: "/apply", title: "지원" },
  { prefix: "/login", title: "로그인" },
];

function getWindowTitle(pathname) {
  if (pathname === "/") return "대시보드";
  return routeTitles.find((route) => pathname.startsWith(route.prefix))?.title ?? "페이지";
}

export default function MacShell({ children }) {
  const { pathname } = useLocation();
  const windowTitle = getWindowTitle(pathname);

  return (
    <div className="mac-desktop">
      <section className="app-frame" aria-label="전북대학교 LIKELION 14기 데스크톱 앱">
        <aside className="app-sidebar">
          <div className="sidebar-controls" aria-hidden="true">
            <span className="traffic-dot red" />
            <span className="traffic-dot yellow" />
            <span className="traffic-dot green" />
          </div>

          <NavLink className="sidebar-brand" to="/">
            <span className="brand-mark">L</span>
            <span>
              <strong>LIKELION</strong>
              <small>전북대학교 × 14기</small>
            </span>
          </NavLink>

          <nav className="sidebar-nav" aria-label="주요 메뉴">
            {navItems.map(({ to, label, ko, icon: Icon }) => (
              <NavLink
                className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                key={to}
                to={to}
                end={to === "/"}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{ko}</span>
                <small>{label}</small>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <span>Recruiting</span>
            <strong>2026.03</strong>
          </div>
        </aside>

        <div className="app-main">
          <header className="app-topbar">
            <div>
              <span className="topbar-eyebrow">전북대학교 × LIKELION 14기</span>
            </div>
            <label className="topbar-search">
              <Search size={16} strokeWidth={1.8} />
              <input type="search" placeholder="검색" aria-label="콘텐츠 검색" />
            </label>
          </header>

          <main className="content-panel">{children}</main>
        </div>
      </section>
    </div>
  );
}
