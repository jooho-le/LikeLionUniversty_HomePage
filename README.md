# LIKELION Web Homepage

멋쟁이사자처럼 대학 홈페이지 초안입니다.  
macOS 데스크톱을 콘셉트로, 앱 창 안에서 소개, 프로필, 프로젝트, 신청 페이지를 탐색하는 React 기반 웹사이트입니다.

## 주요 기능

- macOS 스타일 데스크톱 UI
- 상단 메뉴바, 앱 창, 사이드바, Dock 구성
- 창 버튼 동작
  - 빨강: 창 닫기
  - 노랑: 창 최소화
  - 초록: 전체화면 토글
- Dock 왼쪽 `⌘` 버튼 클릭 시 페이지 목록 표시
- Dock, 데스크톱 아이콘, 사이드바 메뉴를 통한 페이지 이동
- 최소화/닫기 상태에서 `public/assets/preview.png` 배경 표시
- 페이지별 파일 분리
- 세부 내용은 추후 수정할 수 있도록 `??` placeholder로 구성

## 기술 스택

- React
- Vite
- React Router DOM
- Lucide React
- CSS

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버 실행 후 브라우저에서 확인합니다.

```txt
http://localhost:5173/
```

## 빌드

```bash
npm run build
```

빌드 결과물은 `dist/`에 생성됩니다.

## 프로젝트 구조

```txt
.
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
├── public/
│   └── assets/
│       └── preview.png                 # 최소화/닫기 상태의 데스크톱 배경 이미지
├── src/
│   ├── main.jsx                        # React 앱 진입점
│   ├── App.jsx                         # 전체 라우팅 설정
│   ├── styles.css                      # 전체 스타일 및 반응형 디자인
│   ├── components/
│   │   ├── MacShell.jsx                # macOS 데스크톱, 앱 창, Dock, 창 기능
│   │   └── PageKit.jsx                 # 공통 헤더, 카드, 패널 컴포넌트
│   ├── pages/
│   │   ├── Home.jsx                    # 홈
│   │   ├── Intro.jsx                   # 소개 메인
│   │   ├── AboutLikeLion.jsx           # 멋사대학이란?
│   │   ├── LikeLionInstagram.jsx       # 멋쟁이사자 인스타
│   │   ├── LikeLionHomepage.jsx        # 멋쟁이사자 홈페이지
│   │   ├── LikeLionPBL.jsx             # 멋쟁이사자 PBL
│   │   ├── BackendSession.jsx          # 백엔드 세션
│   │   ├── BackendContent.jsx          # 백엔드 세션 내용
│   │   ├── BackendDiary.jsx            # 백엔드 세션 일기
│   │   ├── FrontendSession.jsx         # 프론트엔드 세션
│   │   ├── FrontendContent.jsx         # 프론트엔드 세션 내용
│   │   ├── FrontendDiary.jsx           # 프론트엔드 세션 일기
│   │   ├── PlanningDesignSession.jsx   # 기획&디자인 세션
│   │   ├── PlanningDesignContent.jsx   # 기획&디자인 세션 내용
│   │   ├── PlanningDesignDiary.jsx     # 기획&디자인 세션 일기
│   │   ├── Profile.jsx                 # 프로필 메인
│   │   ├── GenerationSelect.jsx        # 기수 선택
│   │   ├── StaffProfile.jsx            # ?기 운영진
│   │   ├── MemberProfile.jsx           # ?기 회원
│   │   ├── Projects.jsx                # 프로젝트 메인
│   │   ├── GenerationProjects.jsx      # 기수별 프로젝트
│   │   ├── ProjectCardNews.jsx         # 프로젝트 카드뉴스
│   │   ├── Apply.jsx                   # 신청 메인
│   │   ├── FAQ.jsx                     # FAQ
│   │   ├── ApplyForm.jsx               # ?기 신청하기
│   │   ├── Login.jsx                   # 로그인
│   │   └── NotFound.jsx                # 404 페이지
└── .gitignore
```

## 주요 파일

- `src/App.jsx`: 전체 라우팅 관리
- `src/components/MacShell.jsx`: macOS 데스크톱, 앱 창, Dock, 창 버튼 동작
- `src/components/PageKit.jsx`: 공통 페이지 헤더, 카드, 패널 컴포넌트
- `src/pages/`: 페이지별 화면 파일
- `src/styles.css`: 전체 디자인 및 반응형 스타일
- `public/assets/preview.png`: 최소화/닫기 상태에서 표시되는 배경 이미지

## 페이지 구성

- `/`: 홈
- `/intro`: 소개
- `/intro/about`: 멋사대학이란?
- `/intro/backend`: 백엔드 세션
- `/intro/frontend`: 프론트엔드 세션
- `/intro/planning-design`: 기획&디자인 세션
- `/profile`: 프로필
- `/profile/generation`: 기수 선택
- `/profile/staff`: ?기 운영진
- `/profile/members`: ?기 회원
- `/projects`: 프로젝트
- `/projects/generation`: 기수별 프로젝트
- `/projects/card-news`: 프로젝트 카드뉴스
- `/apply`: 신청
- `/apply/faq`: FAQ
- `/apply/form`: ?기 신청하기
- `/login`: 로그인

## 수정 가이드

세부 내용은 각 페이지 파일 안의 `??`를 찾아 수정하면 됩니다.

예시:

```txt
src/pages/Home.jsx
src/pages/Intro.jsx
src/pages/ProjectCardNews.jsx
```

최소화/닫기 상태의 배경 이미지를 바꾸려면 아래 파일을 교체합니다.

```txt
public/assets/preview.png
```
