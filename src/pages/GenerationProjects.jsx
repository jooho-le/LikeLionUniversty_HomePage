import { useEffect, useRef, useState } from "react";
import { ChevronDown, X, GitBranch, ExternalLink, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { BackLink } from "../components/PageKit.jsx";
import { PROJECTS as INITIAL_PROJECTS, GENERATIONS, EVENTS } from "../data/projects.js";

/* ── 기수 드롭다운 (나중에 정렬용으로도 활용 가능) ── */
function GenDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="proj-dropdown" ref={ref}>
      <button
        className={`proj-dropdown-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value}</span>
        <ChevronDown size={14} strokeWidth={2.2} className="proj-dropdown-chevron" />
      </button>
      {open && (
        <div className="proj-dropdown-menu" role="listbox">
          {options.map((opt) => (
            <button
              key={opt}
              className={`proj-dropdown-item${value === opt ? " active" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
              type="button"
              role="option"
              aria-selected={value === opt}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 등록 모달 ── */
const EMPTY_FORM = {
  title: "",
  subtitle: "",
  generation: "14기",
  event: "자체 프로젝트",
  description: "",
  imageUrl: "",
  github: "",
  deployUrl: "",
  members: [],
  newName: "",
  newRole: "",
};

function RegisterModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const addMember = () => {
    if (!form.newName.trim()) return;
    setForm((prev) => ({
      ...prev,
      members: [...prev.members, { name: prev.newName.trim(), role: prev.newRole.trim() }],
      newName: "",
      newRole: "",
    }));
  };

  const removeMember = (idx) => {
    setForm((prev) => ({ ...prev, members: prev.members.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.subtitle.trim()) {
      setError("프로젝트 이름과 한 줄 소개는 필수입니다.");
      return;
    }
    onAdd({
      id: Date.now(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      generation: form.generation,
      event: form.event,
      description: form.description.trim(),
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      github: form.github.trim(),
      deployUrl: form.deployUrl.trim(),
      members: form.members,
    });
    onClose();
    alert("프로젝트가 성공적으로 등록되었습니다!");
  };

  return (
    <div className="proj-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="프로젝트 등록">
      <div className="proj-modal proj-register-modal" onClick={(e) => e.stopPropagation()}>
        <button className="proj-modal-close" onClick={onClose} aria-label="닫기" type="button">
          <X size={17} strokeWidth={2} />
        </button>

        <div className="proj-modal-body">
          <h2 className="proj-modal-title">프로젝트 등록</h2>
          <p className="proj-modal-desc" style={{ marginTop: -8 }}>
            새로운 프로젝트를 아카이브에 추가합니다.
          </p>

          <form className="proj-register-form" onSubmit={handleSubmit}>
            {/* 이름 + 한 줄 소개 */}
            <div className="proj-form-row">
              <label>
                프로젝트 이름 <span className="proj-form-req">*</span>
                <input type="text" placeholder="예: 로컬마켓" value={form.title} onChange={set("title")} required />
              </label>
              <label>
                한 줄 소개 <span className="proj-form-req">*</span>
                <input type="text" placeholder="예: 농부와 소비자를 잇는 직거래 플랫폼" value={form.subtitle} onChange={set("subtitle")} required />
              </label>
            </div>

            {/* 기수 + 행사 */}
            <div className="proj-form-row proj-form-row-2">
              <label>
                기수
                <select value={form.generation} onChange={set("generation")}>
                  {GENERATIONS.filter((g) => g !== "전체").map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </label>
              <label>
                행사 분류
                <select value={form.event} onChange={set("event")}>
                  {EVENTS.filter((e) => e !== "전체").map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* 설명 */}
            <label>
              상세 설명
              <textarea rows={3} placeholder="기획 배경과 주요 기능을 설명해 주세요." value={form.description} onChange={set("description")} />
            </label>

            {/* 썸네일 */}
            <label>
              대표 이미지 URL
              <input type="url" placeholder="https://... (추가 이미지는 등록 후 수정 가능)" value={form.imageUrl} onChange={set("imageUrl")} />
            </label>

            {/* 링크 */}
            <div className="proj-form-row">
              <label>
                GitHub URL
                <input type="url" placeholder="https://github.com/..." value={form.github} onChange={set("github")} />
              </label>
              <label>
                배포 URL
                <input type="url" placeholder="https://..." value={form.deployUrl} onChange={set("deployUrl")} />
              </label>
            </div>

            <div className="proj-form-divider" />

            {/* 팀원 동적 추가 */}
            <div className="proj-member-section">
              <p className="proj-form-hint">팀원을 한 명씩 추가하세요.</p>

              <div className="proj-member-add-row">
                <input
                  type="text"
                  className="proj-member-input"
                  placeholder="이름"
                  value={form.newName}
                  onChange={set("newName")}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMember(); } }}
                />
                <input
                  type="text"
                  className="proj-member-input"
                  placeholder="역할 (예: 프론트엔드, 디자인)"
                  value={form.newRole}
                  onChange={set("newRole")}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMember(); } }}
                />
                <button type="button" className="proj-member-add-btn" onClick={addMember} aria-label="팀원 추가">
                  <Plus size={15} strokeWidth={2.2} />
                  추가
                </button>
              </div>

              {form.members.length > 0 && (
                <ul className="proj-member-list">
                  {form.members.map((m, i) => (
                    <li key={i} className="proj-member-chip">
                      <span className="proj-member-chip-name">{m.name}</span>
                      {m.role && <span className="proj-member-chip-role">{m.role}</span>}
                      <button
                        type="button"
                        className="proj-member-chip-remove"
                        onClick={() => removeMember(i)}
                        aria-label={`${m.name} 삭제`}
                      >
                        <Trash2 size={13} strokeWidth={2} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && <p className="proj-form-error">{error}</p>}

            <div className="proj-modal-actions" style={{ marginTop: 4 }}>
              <button type="button" className="proj-modal-btn github" onClick={onClose}>취소</button>
              <button type="submit" className="proj-modal-btn deploy">등록하기</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── 이미지 캐러셀 ── */
function ImageCarousel({ images, title }) {
  const [idx, setIdx] = useState(0);
  const hasMany = images.length > 1;

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  if (!images.length) {
    return (
      <div className="proj-modal-img">
        <span>{title}</span>
      </div>
    );
  }

  return (
    <div className="proj-carousel">
      <img
        key={idx}
        src={images[idx]}
        alt={`${title} 이미지 ${idx + 1}`}
        className="proj-carousel-img"
      />

      {hasMany && (
        <>
          <button className="proj-carousel-btn prev" onClick={prev} type="button" aria-label="이전 이미지">
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <button className="proj-carousel-btn next" onClick={next} type="button" aria-label="다음 이미지">
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>
          <div className="proj-carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`proj-carousel-dot${i === idx ? " active" : ""}`}
                onClick={() => setIdx(i)}
                type="button"
                aria-label={`이미지 ${i + 1}로 이동`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── 프로젝트 상세 모달 ── */
function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="proj-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="proj-modal" onClick={(e) => e.stopPropagation()}>
        <button className="proj-modal-close" onClick={onClose} aria-label="닫기" type="button">
          <X size={17} strokeWidth={2} />
        </button>

        <ImageCarousel images={project.images ?? []} title={project.title} />

        <div className="proj-modal-body">
          <div className="proj-modal-badges">
            <span className="proj-modal-event">{project.generation}</span>
            <span className="proj-modal-event">{project.event}</span>
          </div>
          <h2 className="proj-modal-title">{project.title}</h2>
          <p className="proj-modal-desc">{project.description}</p>

          {project.members?.length > 0 && (
            <div className="proj-modal-team">
              <span className="proj-modal-team-label">팀원</span>
              <div className="proj-modal-members">
                {project.members.map((m, i) => (
                  <div key={i} className="proj-modal-member-chip">
                    <span className="proj-modal-member-name">{m.name}</span>
                    {m.role && <span className="proj-modal-member-role">{m.role}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(project.github || project.deployUrl) && (
            <div className="proj-modal-actions">
              {project.github && (
                <a className="proj-modal-btn github" href={project.github} target="_blank" rel="noopener noreferrer">
                  <GitBranch size={16} strokeWidth={1.8} />
                  GitHub
                </a>
              )}
              {project.deployUrl && (
                <a className="proj-modal-btn deploy" href={project.deployUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} strokeWidth={1.8} />
                  서비스 바로가기
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 프로젝트 카드 ── */
function ProjectCard({ project, onClick }) {
  const thumb = project.images?.[0];
  return (
    <button className="proj-card" onClick={onClick} type="button" aria-label={`${project.title} 상세 보기`}>
      <div className="proj-card-thumb">
        {thumb
          ? <img src={thumb} alt={project.title} />
          : <span>{project.title}</span>
        }
      </div>
      <div className="proj-card-body">
        <h3 className="proj-card-title">{project.title}</h3>
        <p className="proj-card-desc">{project.subtitle}</p>
        <div className="proj-card-tags">
          <span className="proj-card-tag proj-card-tag--gen">{project.generation}</span>
          <span className="proj-card-tag proj-card-tag--event">{project.event}</span>
        </div>
      </div>
    </button>
  );
}

/* ── 메인 페이지 ── */
export default function GenerationProjects() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [genFilter, setGenFilter] = useState("전체");
  const [eventFilter, setEventFilter] = useState("전체");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const filtered = projects.filter((p) => {
    const matchGen = genFilter === "전체" || p.generation === genFilter;
    const matchEvent = eventFilter === "전체" || p.event === eventFilter;
    return matchGen && matchEvent;
  });

  return (
    <div className="page-stack">
      <BackLink to="/projects" label="프로젝트" />

      <section className="proj-compact-header">
        <p className="eyebrow">Projects</p>
        <h1 className="proj-compact-title">기수별 프로젝트</h1>
        <p className="proj-compact-desc">
          멋쟁이사자처럼 전북대학교 학생들이 열정으로 만들어낸 혁신적인 웹 서비스와 도전의 기록들입니다.
          아이디어톤부터 중앙 해커톤까지, 기수별로 성장해 온 우리들의 모든 프로젝트 아카이브를 한눈에 확인해 보세요.
        </p>
      </section>

      <section className="intro-section proj-archive">
        <div className="split-heading">
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <span>Archive</span>
            <h2>프로젝트 모음</h2>
          </div>
          <button className="proj-add-btn" type="button" onClick={() => setShowRegister(true)}>
            <Plus size={15} strokeWidth={2.2} />
            프로젝트 등록
          </button>
        </div>

        {/* 필터 바 — 행사 태그(좌) + 기수 드롭다운(우) */}
        <div className="proj-filter-bar">
          <div className="proj-filter-row" role="tablist" aria-label="행사 필터">
            {EVENTS.map((e) => (
              <button
                key={e}
                className={`proj-filter-btn${eventFilter === e ? " active" : ""}`}
                onClick={() => setEventFilter(e)}
                type="button"
                role="tab"
                aria-selected={eventFilter === e}
              >
                {e}
              </button>
            ))}
          </div>
          <GenDropdown value={genFilter} options={GENERATIONS} onChange={setGenFilter} />
        </div>

        <div className="proj-grid">
          {filtered.length > 0 ? (
            filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))
          ) : (
            <p className="project-empty">해당 조건의 프로젝트가 없습니다.</p>
          )}
        </div>
      </section>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} onAdd={(p) => setProjects((prev) => [p, ...prev])} />
      )}
    </div>
  );
}
