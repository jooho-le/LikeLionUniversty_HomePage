import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpenText, CalendarDays, FileText, Search } from "lucide-react";

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
                  <span className="board-arrow-placeholder" aria-hidden="true" />
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
              <article className="board-row board-row-static" key={post.id}>
                {rowContent}
              </article>
            );
          })
        ) : (
          <div className="board-empty">
            <strong>검색 결과가 없습니다.</strong>
            <span>다른 키워드나 분류를 선택해보세요.</span>
          </div>
        )}
      </div>
    </section>
  );
}
