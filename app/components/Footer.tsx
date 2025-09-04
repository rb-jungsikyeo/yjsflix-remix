import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div>
            <h3 className="text-2xl font-bold text-red-600 mb-4">YJSFLIX</h3>
            <p className="text-gray-400 text-sm">
              수백만 개의 영화, TV 프로그램을 탐색하세요.
            </p>
          </div>

          {/* 퀵 링크 */}
          <div>
            <h4 className="text-white font-semibold mb-4">둘러보기</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  홈
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  영화
                </Link>
              </li>
              <li>
                <Link to="/tv" className="text-gray-400 hover:text-white transition-colors text-sm">
                  TV 프로그램
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors text-sm">
                  검색
                </Link>
              </li>
            </ul>
          </div>

          {/* 카테고리 */}
          <div>
            <h4 className="text-white font-semibold mb-4">카테고리</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">액션</li>
              <li className="text-gray-400 text-sm">코미디</li>
              <li className="text-gray-400 text-sm">드라마</li>
              <li className="text-gray-400 text-sm">스릴러</li>
              <li className="text-gray-400 text-sm">SF</li>
            </ul>
          </div>

          {/* 정보 */}
          <div>
            <h4 className="text-white font-semibold mb-4">정보</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">이용약관</li>
              <li className="text-gray-400 text-sm">개인정보처리방침</li>
              <li className="text-gray-400 text-sm">쿠키 정책</li>
              <li className="text-gray-400 text-sm">문의하기</li>
            </ul>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 YJSFLIX. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Powered by{" "}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                TMDb API
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}