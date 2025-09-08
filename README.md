# YJSFLIX - 영화 정보 웹사이트

넷플릭스 스타일의 영화 및 TV 프로그램 정보를 제공하는 React 기반 웹 애플리케이션입니다.

## 🚀 기술 스택

- **Remix** - 풀스택 React 프레임워크 (SSR/SSG)
- **React 18** - TypeScript 5.6 지원
- **Vite** - 빌드 도구 및 개발 서버
- **TailwindCSS 3.4** - 유틸리티 우선 CSS 프레임워크
- **@preact/signals-react** - 반응형 상태 관리
- **TMDb API** - 영화/TV 데이터 소스
- **LRU Cache + Cachified** - 서버 사이드 캐싱

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
# Vite 개발 서버 시작
pnpm dev
# 또는
npm run dev
```

개발 서버는 http://localhost:5173 (Vite) 에서 실행됩니다.

### 프로덕션 빌드
```bash
# 프로덕션 빌드 (경고 비활성화)
npm run build
# 또는
pnpm build
```

## 📁 프로젝트 구조

```
app/                         # Remix 앱 디렉토리
├── root.tsx                # 루트 레이아웃
├── entry.client.tsx        # 클라이언트 진입점
├── entry.server.tsx        # 서버 진입점
├── routes/                 # 파일 기반 라우팅
│   ├── _index.tsx         # 홈 페이지
│   ├── movies._index.tsx  # 영화 목록
│   ├── movies.$movieId.tsx # 영화 상세
│   ├── tv._index.tsx      # TV 목록
│   ├── tv.$showId.tsx     # TV 상세
│   ├── search.tsx         # 검색 페이지
│   └── api.image.tsx      # 이미지 프록시 API
├── components/             # UI 컴포넌트
│   ├── ui/                # 기본 UI 요소
│   ├── animations/        # 애니메이션 컴포넌트
│   └── [기타 컴포넌트]     # ContentCard, Navigation 등
├── services/               # 백엔드 서비스
│   └── tmdb.server.ts     # TMDb API 서비스
├── state/                  # 상태 관리
│   └── signals.ts         # Preact Signals
├── utils/                  # 유틸리티
│   └── cache.server.ts    # LRU 캐시
└── assets/                 # 정적 에셋
    └── styles/            # CSS 파일
```

## 🔧 설정 파일

- `vite.config.ts` - Vite + Remix 빌드 설정
- `tailwind.config.js` - TailwindCSS 커스터마이징
- `postcss.config.js` - PostCSS 설정 (TailwindCSS 통합)
- `tsconfig.json` - TypeScript 설정 (strict mode)
- `vercel.json` - Vercel 배포 설정

## 🌐 API 엔드포인트

TMDb API v3 사용:
- Base URL: `https://api.themoviedb.org/3/`
- 영화: 현재 상영중, 개봉 예정, 인기, 트렌딩
- TV: 최고 평점, 인기, 오늘 방영
- 검색: 영화 및 TV 프로그램

## 🚦 라우팅

- `/` - 홈 (트렌딩 콘텐츠)
- `/movies` - 영화 목록
- `/movies/:movieId` - 영화 상세 정보
- `/tv` - TV 프로그램 목록
- `/tv/:showId` - TV 프로그램 상세 정보
- `/search` - 검색 결과

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

## 📊 개발 현황
**전체 진행률**: 100% 완료 (10/10 작업, 50/50 서브작업)

자세한 개발 현황은 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) 참조

## 🎯 주요 업데이트 (2025.09)
- ✅ Remix 프레임워크로 완전 마이그레이션
- ✅ 서버 사이드 렌더링(SSR) 구현
- ✅ Signals 기반 상태 관리 시스템 (구현 완료, 활용 대기)
- ✅ LRU 캐시 + Cachified로 성능 최적화
- ✅ 모든 주요 기능 구현 완료

## 📝 기술 상세

### 캐싱 전략
- **LRU 캐시**: 최대 100개 항목, 기본 TTL 5분
- **API별 TTL**: 트렌딩(10분), 인기(30분), 상세(24시간)
- **Cachified**: TMDb API 응답 자동 캐싱

### Signals 상태 관리
- **글로벌 상태**: 즐겨찾기, 검색, UI 상태
- **localStorage 연동**: 자동 저장/불러오기
- **Computed Values**: 반응형 파생 상태