import { SearchBar } from "@/components/search-bar";
import { usersQuery } from "@/lib/api/queryOptions";
import { useIsPending } from "@/lib/misc";
import { cn, getUserImgSrc } from "@/lib/utils";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const searchTerm = new URL(request.url).searchParams.get("search") ?? "";
    await queryClient.ensureQueryData(usersQuery(searchTerm));
    return { searchTerm };
  };

export default function UsersIndex() {
  const { searchTerm } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;
  const { data: users } = useSuspenseQuery(usersQuery(searchTerm));
  const isPending = useIsPending({
    formMethod: "get",
    formAction: "/users",
  });
  return (
    <div className="container mb-48 mt-36 flex flex-col items-center justify-center gap-6">
      <h1 className="text-h1">Epic Notes Users</h1>
      <div className="w-full max-w-[700px] ">
        <SearchBar autoFocus autoSubmit />
      </div>
      <main>
        {users.length ? (
          <ul
            className={cn(
              "flex w-full flex-wrap items-center justify-center gap-4 delay-200",
              { "opacity-50": isPending }
            )}
          >
            {users.map((user) => (
              <li key={user.id}>
                <Link
                  to={user.username}
                  className="flex h-36 w-44 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3"
                >
                  <img
                    alt={user.name ?? user.username}
                    src={getUserImgSrc(user.imageId)}
                    className="h-16 w-16 rounded-full"
                  />
                  {user.name ? (
                    <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-body-md">
                      {user.name}
                    </span>
                  ) : null}
                  <span className="w-full overflow-hidden text-ellipsis text-center text-body-sm text-muted-foreground">
                    {user.username}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )}
      </main>
    </div>
  );
}
