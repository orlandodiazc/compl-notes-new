import { notesQuery } from "@/lib/api/queryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

export default function NoteIndex() {
  const { username } = useParams() as { username: string };
  const { data: user } = useSuspenseQuery(notesQuery(username));
  const displayName = user.name ?? username;
  const noteCount = user.notes.length ?? 0;
  const notesText = noteCount === 1 ? "note" : "notes";
  return (
    <div className="container pt-12">
      <Helmet>
        <title>{`${displayName}'s Notes | Epic Notes`}</title>
        <meta
          name="description"
          content={`Checkout ${displayName}'s ${noteCount} ${notesText} on Epic Notes`}
        />
      </Helmet>
      <p className="text-body-md">Select a note</p>
    </div>
  );
}
