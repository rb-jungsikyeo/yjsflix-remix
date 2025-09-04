import { Link, useLocation } from "@remix-run/react";
import yjsflix from "~/assets/yjsflix.png";
import SearchIcon from "./ui/SearchIcon";

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
    <header className="fixed top-0 left-0 w-full h-14 px-4 flex items-center bg-black opacity-80 z-50 shadow-header text-white text-xl font-medium">
      <div className="w-full flex justify-between">
        <ul className="flex">
          <li className="w-20 md:w-32 h-14">
            <Link to="/" className="h-14 flex justify-start items-center">
              <img src={yjsflix} alt="yjsflix" className="w-28" />
            </Link>
          </li>
          <li
            className={`w-10 md:w-20 h-14 ml-10 text-center border-b-2 ${
              pathname === "/"
                ? `border-red-500`
                : `border-transparent font-extralight opacity-40`
            }`}
          >
            <Link to="/" className="h-14 flex justify-center items-center">
              Home
            </Link>
          </li>
          <li
            className={`w-10 md:w-20 h-14 ml-7 md:ml-10 text-center border-b-2 ml-4 ${
              pathname.indexOf("/movie") >= 0
                ? `border-red-500`
                : `border-transparent font-extralight opacity-40`
            }`}
          >
            <Link to="/movies" className="h-14 flex justify-center items-center">
              Movies
            </Link>
          </li>
          <li
            className={`w-10 md:w-20 h-14 ml-7 md:ml-10 text-center border-b-2 ml-4 ${
              pathname.indexOf("/tv") >= 0 || pathname.indexOf("/show") >= 0
                ? `border-red-500`
                : `border-transparent font-extralight opacity-40`
            }`}
          >
            <Link to="/tv" className="h-14 flex justify-center items-center">
              TV
            </Link>
          </li>
        </ul>
        <ul className="flex">
          <li
            className={`w-10 md:w-20 h-14 ml-7 md:ml-10 text-center border-b-2 ${
              pathname === "/search" ? `border-red-700` : `border-transparent`
            }`}
          >
            <Link to="/search" className="h-14 flex justify-center items-center">
              <SearchIcon className="w-5 h-5 text-white" />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}