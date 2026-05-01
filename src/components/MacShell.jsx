import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ClipboardList,
  FolderKanban,
  Home,
  Info,
  LogIn,
  Monitor,
  Search,
  UserRound,
  Wifi,
} from "lucide-react";
import { MacTrafficLights } from "./PageKit.jsx";

const navItems = [
  { to: "/", label: "HOME", ko: "홈", icon: Home },
  { to: "/intro", label: "ABOUT", ko: "소개", icon: Info },
  { to: "/projects", label: "PROJECTS", ko: "프로젝트", icon: FolderKanban },
  { to: "/profile", label: "MEMBERS", ko: "프로필", icon: UserRound },
  { to: "/apply", label: "APPLY", ko: "신청", icon: ClipboardList },
];

const dockMenuItems = [...navItems, { to: "/login", label: "LOGIN", ko: "로그인", icon: LogIn }];

const routeTitles = [
  { prefix: "/intro", title: "소개" },
  { prefix: "/projects", title: "프로젝트" },
  { prefix: "/profile", title: "프로필" },
  { prefix: "/apply", title: "신청" },
  { prefix: "/login", title: "로그인" },
];

function getWindowTitle(pathname) {
  if (pathname === "/") return "홈";
  return routeTitles.find((route) => pathname.startsWith(route.prefix))?.title ?? "페이지";
}

export default function MacShell({ children }) {
  const { pathname } = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDockMenuOpen, setIsDockMenuOpen] = useState(false);
  const windowTitle = getWindowTitle(pathname);

  useEffect(() => {
    setIsMinimized(false);
    setIsClosed(false);
    setIsDockMenuOpen(false);
  }, [pathname]);

  const restoreWindow = () => {
    setIsMinimized(false);
    setIsClosed(false);
    setIsDockMenuOpen(false);
  };

  const windowClassName = [
    "app-window",
    isFullscreen ? "fullscreen" : "",
    isMinimized ? "minimized" : "",
    isClosed ? "closed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`mac-desktop${isClosed || isMinimized ? " show-wallpaper" : ""}`}>
      <header className="mac-menu">
        <div className="menu-left">
          <strong>LIKELION</strong>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Window</span>
        </div>
        <div className="menu-right">
          <Search size={14} />
          <Wifi size={15} />
          <span>??:??</span>
        </div>
      </header>

      <aside className="desktop-icons" aria-label="데스크톱 바로가기">
        {navItems.slice(1).map(({ to, ko, icon: Icon }) => (
          <Link className="desktop-icon" key={to} to={to} onClick={restoreWindow}>
            <span>
              <Icon size={25} />
            </span>
            <strong>{ko}</strong>
          </Link>
        ))}
      </aside>

      {!isClosed && !isMinimized && (
        <section className={windowClassName} aria-label="LIKELION 앱 창">
          <header className="window-toolbar">
            <div className="window-controls">
              <button
                className="window-control red"
                type="button"
                aria-label="창 닫기"
                onClick={() => setIsClosed(true)}
              />
              <button
                className="window-control yellow"
                type="button"
                aria-label="창 최소화"
                onClick={() => setIsMinimized(true)}
              />
              <button
                className="window-control green"
                type="button"
                aria-label="전체화면 전환"
                onClick={() => setIsFullscreen((value) => !value)}
              />
            </div>

            <div className="window-title">
              <Monitor size={15} />
              <span>LIKELION / {windowTitle}</span>
            </div>

            <div className="window-search">
              <Search size={14} />
              <span>??</span>
            </div>
          </header>

          <div className="window-layout">
            <aside className="window-sidebar">
              <Link className="window-brand" to="/" onClick={restoreWindow}>
                <span className="brand-logo" aria-hidden="true">
                  <span className="logo-face">L</span>
                </span>
                <span>
                  <strong>LIKELION</strong>
                  <small>??대학교 × ?기</small>
                </span>
              </Link>

              <nav className="window-nav" aria-label="주요 메뉴">
                {navItems.map(({ to, label, ko, icon: Icon }) => (
                  <NavLink
                    className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                    key={to}
                    to={to}
                    end={to === "/"}
                    onClick={restoreWindow}
                  >
                    <Icon size={17} />
                    <span>{ko}</span>
                    <small>{label}</small>
                  </NavLink>
                ))}
              </nav>
            </aside>

            <div className="window-main">
              <div className="window-page-tabs">
                <div className="active-tab">
                  <MacTrafficLights />
                  <span>{windowTitle}</span>
                </div>
                <Link className="tab-action" to="/login" onClick={restoreWindow}>
                  <LogIn size={15} />
                  <span>LOGIN</span>
                </Link>
              </div>
              <main className="content-panel">{children}</main>
            </div>
          </div>
        </section>
      )}

      {(isClosed || isMinimized) && (
        <button className="minimized-preview" type="button" onClick={restoreWindow}>
          <span className="preview-titlebar">
            <MacTrafficLights />
            <strong>LIKELION.app</strong>
          </span>
          <span className="preview-screen">
            <span className="preview-caption">
              <strong>{windowTitle}</strong>
              <em>{isClosed ? "닫힌 창" : "최소화됨"}</em>
            </span>
          </span>
        </button>
      )}

      <nav className="dock" aria-label="Dock">
        <button
          className={`dock-icon finder${isDockMenuOpen ? " active" : ""}`}
          type="button"
          aria-expanded={isDockMenuOpen}
          aria-label="페이지 목록 열기"
          onClick={() => setIsDockMenuOpen((value) => !value)}
          title="페이지 목록"
        >
          <span>⌘</span>
        </button>

        {isDockMenuOpen && (
          <div className="dock-page-menu" role="menu" aria-label="페이지 목록">
            <div className="dock-menu-header">
              <MacTrafficLights />
              <strong>Pages</strong>
            </div>
            <div className="dock-menu-list">
              {dockMenuItems.map(({ to, label, ko, icon: Icon }) => (
                <NavLink
                  className={({ isActive }) => `dock-menu-item${isActive ? " active" : ""}`}
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={restoreWindow}
                  role="menuitem"
                >
                  <span className={`menu-item-icon dock-${label.toLowerCase()}`}>
                    <Icon size={17} />
                  </span>
                  <span>
                    <strong>{ko}</strong>
                    <small>{label}</small>
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {navItems.map(({ to, ko, icon: Icon }) => (
          <NavLink
            className={({ isActive }) => `dock-icon dock-${to === "/" ? "home" : to.slice(1)}${isActive ? " active" : ""}`}
            key={to}
            to={to}
            end={to === "/"}
            onClick={restoreWindow}
            title={ko}
          >
            <Icon size={22} />
          </NavLink>
        ))}
        <NavLink className="dock-icon dock-login apply" to="/login" onClick={restoreWindow} title="로그인">
          <LogIn size={22} />
        </NavLink>
      </nav>
    </div>
  );
}
