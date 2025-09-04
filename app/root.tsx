import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { SignalsProvider } from "~/context/SignalsProvider";
import Header from "~/components/Header";

import "./assets/styles/reset.css";
import "./assets/styles/index.css";
import "./assets/styles/tailwind.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 개발 환경에서 디버깅 도구 로드
if (process.env.NODE_ENV === 'development') {
  import('~/utils/signals-debug');
}

export const meta: MetaFunction = () => {
  return [
    { title: "YJSFLIX" },
    { name: "description", content: "영화와 TV 프로그램 정보를 제공하는 넷플릭스 스타일 웹사이트" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 다크모드 초기화 스크립트
              (function() {
                try {
                  const darkMode = localStorage.getItem('darkMode');
                  if (darkMode === 'true' || (!darkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full font-sans antialiased">
        <SignalsProvider>
          {children}
        </SignalsProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <div className="pt-14"> {/* Header 높이만큼 패딩 추가 */}
        <Outlet />
      </div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = "알 수 없는 오류가 발생했습니다.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data || error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        <title>오류 - YJSFLIX</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-black text-white">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-red-600">{errorStatus}</h1>
            <h2 className="mt-4 text-2xl font-semibold">오류가 발생했습니다</h2>
            <p className="mt-2 text-gray-400">{errorMessage}</p>
            <a
              href="/"
              className="mt-6 inline-block rounded bg-red-600 px-6 py-3 text-white transition hover:bg-red-700"
            >
              홈으로 돌아가기
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
