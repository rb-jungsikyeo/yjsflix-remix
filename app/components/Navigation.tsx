import { Link, useLocation } from "@remix-run/react";
import { useState, useEffect } from "react";

export default function Navigation() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-sm" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* 로고 */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-red-600">YJSFLIX</span>
            </Link>

            {/* 메인 네비게이션 */}
            <ul className="hidden md:flex items-center space-x-6">
              <li>
                <Link
                  to="/"
                  className={`transition-colors hover:text-gray-300 ${
                    isActive("/") ? "text-white font-medium" : "text-gray-400"
                  }`}
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  to="/movies"
                  className={`transition-colors hover:text-gray-300 ${
                    isActive("/movies") ? "text-white font-medium" : "text-gray-400"
                  }`}
                >
                  영화
                </Link>
              </li>
              <li>
                <Link
                  to="/tv"
                  className={`transition-colors hover:text-gray-300 ${
                    isActive("/tv") ? "text-white font-medium" : "text-gray-400"
                  }`}
                >
                  TV 프로그램
                </Link>
              </li>
            </ul>
          </div>

          {/* 오른쪽 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* 검색 */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="검색"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              
              {searchOpen && (
                <div className="absolute right-0 mt-2">
                  <form action="/search" method="get">
                    <input
                      type="text"
                      name="query"
                      placeholder="검색..."
                      className="w-64 px-4 py-2 bg-black/90 border border-gray-700 rounded-lg focus:outline-none focus:border-red-600 text-white"
                      autoFocus
                    />
                  </form>
                </div>
              )}
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="메뉴"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}