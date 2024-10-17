import { SearchBar } from "@/components/search-bar";

import { Helmet } from "react-helmet";
import {
  Link,
  Outlet,
  ScrollRestoration,
  useMatch,
  useNavigation,
} from "react-router-dom";
import { useSpinDelay } from "spin-delay";

export default function Root() {
  const match = useMatch("/users");
  const navigation = useNavigation();
  const isOnSearchPage = !!match;
  const showLoading = useSpinDelay(navigation.state === "loading", {
    delay: 500,
    minDuration: 200,
  });
  return (
    <>
      {showLoading && (
        <div
          className="fixed top-0 left-0 h-[300px] w-full
        transition-all duration-300 pointer-events-none
        z-30 dark:h-[200px] dark:!bg-white/10 dark:rounded-[100%] delay-300 opacity-100 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(closest-side, rgba(0, 10, 40, 0.3) 5%, rgba(0, 0, 0, 0) 85%)",
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[30px] p-2 bg-gray-200 dark:bg-gray-800
        rounded-lg"
          >
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="0"
              viewBox="0 0 24 24"
              className="text-3xl animate-spin"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.2"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="currentColor"
              ></path>
              <path
                d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      )}
      <Helmet>
        <title>Compl Notes</title>
        <meta name="description" content="Your own captain's log" />
      </Helmet>
      <header className="container mx-auto py-6">
        <nav className="flex">
          <Link to="/">
            <div className="font-light">epic</div>
            <div className="font-bold">notes</div>
          </Link>
          <div className="flex justify-end w-full items-center gap-6">
            {isOnSearchPage ? null : (
              <div className="ml-auto max-w-sm flex-1">
                <SearchBar />
              </div>
            )}
            <Link className="underline" to="/users">
              All users
            </Link>
            <Link className="underline" to="/users/admin/notes">
              Admin's Notes
            </Link>
          </div>
        </nav>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      <div className="container mx-auto flex justify-between">
        <Link to="/">
          <div className="font-light">epic</div>
          <div className="font-bold">notes</div>
        </Link>
        <p>Built with ♥️</p>
      </div>
      <div className="h-5" />
      <ScrollRestoration />
    </>
  );
}
