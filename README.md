# YJSFLIX - 영화 정보 웹사이트

넷플릭스 스타일의 영화 및 TV 프로그램 정보를 제공하는 React 기반 웹 애플리케이션입니다.

## 🚀 기술 스택

- **React 17.0.2** - TypeScript 4.1.2 지원
- **React Router DOM 5.2.0** - 클라이언트 사이드 라우팅
- **TailwindCSS** - PostCSS 7 호환 버전으로 스타일링
- **Axios** - HTTP 클라이언트
- **CRACO** - Create React App 설정 커스터마이징
- **TMDb API** - 영화/TV 데이터 소스

## 📋 주요 기능

- 🎬 영화 정보 브라우징 (현재 상영중, 개봉 예정, 인기, 트렌딩)
- 📺 TV 프로그램 정보 (최고 평점, 인기, 오늘 방영)
- 🔍 영화 및 TV 프로그램 검색
- 📄 상세 정보 페이지 (출연진, 예고편, 상세 정보)
- 🎨 넷플릭스 스타일 UI/UX

## 🛠 설치 및 실행

### 사전 요구사항
- Node.js 14 이상
- npm 또는 pnpm

### 설치
```bash
# 의존성 설치
npm install
# 또는
pnpm install
```

### 개발 서버 실행
```bash
# TailwindCSS 빌드와 함께 개발 서버 시작
npm start
# 또는
pnpm dev
```

개발 서버는 http://localhost:5173 에서 실행됩니다.

### 프로덕션 빌드
```bash
# 프로덕션 빌드 (경고 비활성화)
npm run build
# 또는
pnpm build
```

## 📁 프로젝트 구조

```
src/
├── api.tsx                 # TMDb API 설정 및 엔드포인트
├── Components/            
│   ├── Router.tsx         # 메인 라우팅 설정
│   ├── Detail.tsx         # 영화/TV 상세 페이지
│   ├── Header.tsx         # 네비게이션 헤더
│   ├── Loader.tsx         # 로딩 스피너
│   ├── Movie.tsx          # 영화 카드 컴포넌트
│   ├── Search.tsx         # 검색 페이지
│   └── Section.tsx        # 콘텐츠 섹션 컴포넌트
├── pages/                 
│   ├── Home.tsx          # 홈 페이지
│   ├── TV.tsx            # TV 프로그램 페이지
│   └── Movie.tsx         # 영화 페이지
├── index.tsx             # 앱 진입점
└── tailwind/
    └── tailwind.css      # TailwindCSS 스타일
```

## 🔧 설정 파일

- `craco.config.js` - PostCSS/TailwindCSS 빌드 설정
- `tailwind.config.js` - TailwindCSS 커스터마이징
- `tsconfig.json` - TypeScript 설정

## 🌐 API 엔드포인트

TMDb API v3 사용:
- Base URL: `https://api.themoviedb.org/3/`
- 영화: 현재 상영중, 개봉 예정, 인기, 트렌딩
- TV: 최고 평점, 인기, 오늘 방영
- 검색: 영화 및 TV 프로그램

## 🚦 라우팅

- `/` - 홈 (트렌딩 영화)
- `/movie` - 영화 목록
- `/tv` - TV 프로그램 목록
- `/search` - 검색 결과
- `/movie/:id` - 영화 상세 정보
- `/show/:id` - TV 프로그램 상세 정보

## 📝 개발 가이드

### Task Master AI 통합
프로젝트는 Task Master AI로 작업을 관리합니다:

```bash
# 작업 목록 확인
task-master list

# 다음 작업 확인
task-master next

# 작업 상태 업데이트
task-master set-status --id=<id> --status=done
```

자세한 내용은 `.taskmaster/CLAUDE.md` 참조

### 코드 스타일
- TypeScript strict 모드 활성화
- TailwindCSS 유틸리티 클래스 사용
- 함수형 컴포넌트 및 React Hooks 사용