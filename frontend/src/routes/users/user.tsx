import { Spacer } from "@/components/spacer";
import { Button } from "@/components/ui/button";
import { userQuery } from "@/lib/api/queryOptions";
import { getUserImgSrc } from "@/lib/utils";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.username) {
      throw new Error("No username provided");
    }
    await queryClient.ensureQueryData(userQuery(params.username));
    return { username: params.username };
  };

export default function ProfileRoute() {
  const { username } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;
  const { data: user } = useSuspenseQuery(userQuery(username));

  const userDisplayName = user.name ?? user.username;
  return (
    <div className="container mb-48 mt-36 flex flex-col items-center justify-center">
      <Helmet>
        <title>{`${userDisplayName ?? username} | Epic Notes`}</title>
        <meta
          name="description"
          content={`Profile of ${userDisplayName ?? username} on Epic Notes`}
        />
      </Helmet>
      <Spacer size="4xs" />
      <div className="container flex flex-col items-center rounded-3xl bg-muted p-12">
        <div className="relative w-52">
          <div className="absolute -top-40">
            <div className="relative">
              <img
                src={getUserImgSrc(user.image?.id)}
                alt={userDisplayName}
                className="h-52 w-52 rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        <Spacer size="sm" />

        <div className="flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <h1 className="text-center text-h2">{userDisplayName}</h1>
          </div>
          <p className="mt-2 text-center text-muted-foreground">
            Joined{" "}
            {new Date(Number(user.createdAt) * 1000).toLocaleDateString()}
          </p>
          <div className="mt-10 flex gap-4">
            <Button asChild>
              <Link to="notes">{userDisplayName}'s notes</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
