import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpenText, CalendarDays, ExternalLink, FileText, Search, X } from "lucide-react";
import { getApiAssetUrl } from "../lib/api.js";

const filters = [
  { key: "all", label: "전체" },
  { key: "content", label: "세션 내용" },
  { key: "diary", label: "세션 일기" },
];

const typeMeta = {
  content: { label: "세션 내용", icon: FileText },
  diary: { label: "세션 일기", icon: BookOpenText },
};

export default function TrackBoard({ title, description, posts }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesFilter = activeFilter === "all" || post.type === activeFilter;
      const searchableText = [post.title, post.summary, post.week, post.date, ...(post.tags ?? [])]
        .join(" ")
        .toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, posts, query]);

  return (
    <section className="track-board">
      <div className="track-board-head">
        <div>
          <span className="eyebrow">Board</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="track-board-count" aria-label={`현재 ${filteredPosts.length}개 게시글`}>
          <strong>{filteredPosts.length}</strong>
          <span>게시글</span>
        </div>
      </div>

      <div className="track-board-toolbar">
        <div className="board-filter-list" aria-label="게시판 분류">
          {filters.map((filter) => (
            <button
              className={`board-filter-button${activeFilter === filter.key ? " is-active" : ""}`}
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <label className="board-search">
          <Search size={18} strokeWidth={1.8} />
          <input
            aria-label="게시글 검색"
            placeholder="제목, 태그 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div className="board-table">
        <div className="board-table-head" aria-hidden="true">
          <span>분류</span>
          <span>제목</span>
          <span>주차</span>
          <span>작성일</span>
          <span />
        </div>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const meta = typeMeta[post.type] ?? typeMeta.content;
            const TypeIcon = meta.icon;

            const rowContent = (
              <>
                <span className={`board-type ${post.type}`}>
                  <TypeIcon size={16} strokeWidth={1.8} />
                  {meta.label}
                </span>
                <span className="board-title-cell">
                  <strong>{post.title}</strong>
                  <p>{post.summary}</p>
                  <span className="board-tags">
                    {(post.tags ?? []).map((tag) => (
                      <em key={tag}>#{tag}</em>
                    ))}
                  </span>
                </span>
                <span className="board-week">
                  <CalendarDays size={15} strokeWidth={1.8} />
                  {post.week}
                </span>
                <span className="board-date">{post.date}</span>
                {post.to ? (
                  <ArrowRight className="board-arrow" size={19} strokeWidth={1.8} />
                ) : (
                  <ArrowRight className="board-arrow" size={19} strokeWidth={1.8} />
                )}
              </>
            );

            if (post.to) {
              return (
                <Link className="board-row" key={post.id} to={post.to}>
                  {rowContent}
                </Link>
              );
            }

            return (
              <button className="board-row board-row-button" key={post.id} type="button" onClick={() => setSelectedPost(post)}>
                {rowContent}
              </button>
            );
          })
        ) : (
          <div className="board-empty">
            <strong>검색 결과가 없습니다.</strong>
            <span>다른 키워드나 분류를 선택해보세요.</span>
          </div>
        )}
      </div>

      {selectedPost && (
        <div className="board-detail-overlay" role="dialog" aria-modal="true" aria-label="게시글 상세" onClick={() => setSelectedPost(null)}>
          <article className="board-detail-modal" onClick={(event) => event.stopPropagation()}>
            <button className="board-detail-close" type="button" aria-label="닫기" onClick={() => setSelectedPost(null)}>
              <X size={18} strokeWidth={2} />
            </button>
            <span className={`board-type ${selectedPost.type}`}>
              {selectedPost.type === "diary" ? <BookOpenText size={16} strokeWidth={1.8} /> : <FileText size={16} strokeWidth={1.8} />}
              {typeMeta[selectedPost.type]?.label ?? "게시글"}
            </span>
            <h3>{selectedPost.title}</h3>
            <div className="board-detail-meta">
              <span>{selectedPost.week}</span>
              <span>{selectedPost.date}</span>
              {(selectedPost.tags ?? []).map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <p>{selectedPost.content || selectedPost.summary}</p>
            {selectedPost.materialUrl && (
              <a className="board-detail-link" href={getApiAssetUrl(selectedPost.materialUrl)} rel="noreferrer" target="_blank">
                자료 열기
                <ExternalLink size={15} strokeWidth={1.9} />
              </a>
            )}
          </article>
        </div>
      )}
    </section>
  );
}
