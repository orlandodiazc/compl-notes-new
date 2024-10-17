import { Button } from "@/components/ui/button";
import { deleteNote } from "@/lib/api";
import { noteQuery, notesQuery, userQuery } from "@/lib/api/queryOptions";
import { getNoteImgSrc } from "@/lib/utils";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import {
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.username) {
      throw new Error("No username provided");
    }
    if (!params.noteId) {
      throw new Error("No noteId provided");
    }
    await queryClient.ensureQueryData(
      noteQuery({ username: params.username, noteId: params.noteId })
    );
    return { username: params.username, noteId: params.noteId };
  };

export const action =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.username) {
      throw new Error("No username provided");
    }
    if (!params.noteId) {
      throw new Error("No noteId provided");
    }
    await deleteNote({ username: params.username, noteId: params.noteId });
    await queryClient.invalidateQueries({
      queryKey: notesQuery(params.username).queryKey,
    });
    return redirect(`/users/${params.username}/notes`);
  };

export default function NoteRoute() {
  const params = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;
  const { data: note } = useSuspenseQuery(noteQuery(params));
  const { data: user } = useSuspenseQuery(userQuery(params.username));

  const displayName = user.name ?? params.username;
  const noteTitle = note.title ?? "Note";
  const noteContentsSummary =
    note.content.length > 100
      ? note.content.slice(0, 97) + "..."
      : "No content";

  return (
    <div className="absolute inset-0 flex flex-col px-10">
      <Helmet>
        <title>{`${noteTitle} | ${displayName}'s Notes | Epic Notes`}</title>
        <meta name="description" content={noteContentsSummary} />
      </Helmet>
      <h2 className="mb-2 pt-12 text-h2 lg:mb-6">{note.title}</h2>
      <div className="overflow-y-auto pb-24">
        <ul className="flex flex-wrap gap-5 py-5">
          {note.images.map((image) => (
            <li key={image.id}>
              <a href={getNoteImgSrc(image.id)}>
                <img
                  src={getNoteImgSrc(image.id)}
                  alt={image.altText ?? ""}
                  className="h-32 w-32 rounded-lg object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
        <p className="whitespace-break-spaces text-sm md:text-lg">
          {note.content}
        </p>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg bg-muted/80 p-4 pl-5 shadow-xl shadow-accent backdrop-blur-sm md:gap-4 md:pl-7 justify-end">
        <Form method="post">
          {/* <AuthenticityTokenInput /> */}
          <Button
            type="submit"
            variant="destructive"
            name="intent"
            value="delete"
          >
            Delete
          </Button>
        </Form>
        <Button asChild>
          <Link to="edit">Edit</Link>
        </Button>
      </div>
    </div>
  );
}
