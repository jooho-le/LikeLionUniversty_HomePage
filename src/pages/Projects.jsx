import { useEffect, useState } from "react";
import { LinkGrid, PageHeader } from "../components/PageKit.jsx";
import { getProjects } from "../lib/api.js";

const items = [{ to: "/projects/generation", title: "기수별 프로젝트", meta: "Project" }];

export default function Projects() {
  const [projectCount, setProjectCount] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getProjects()
      .then((projects) => {
        if (isMounted) {
          setProjectCount(projects.length);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProjectCount(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Projects"
        title="프로젝트"
        description={
          projectCount === null
            ? "기수별 프로젝트와 카드뉴스를 확인할 수 있습니다."
            : `현재 백엔드에 등록된 프로젝트 ${projectCount}개를 확인할 수 있습니다.`
        }
      />
      <LinkGrid items={items} />
    </div>
  );
}
