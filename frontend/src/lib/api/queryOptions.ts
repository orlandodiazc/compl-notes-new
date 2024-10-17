import { queryOptions } from "@tanstack/react-query";
import { fetchFilteredUsers, fetchNote, fetchNotes, fetchUser } from ".";

export const usersQuery = (searchTerm?: string) =>
  queryOptions({
    queryKey: ["users", "search", searchTerm],
    queryFn: () => fetchFilteredUsers(searchTerm),
  });

export const userQuery = (username: string) =>
  queryOptions({
    queryKey: ["users", username],
    queryFn: () => fetchUser(username),
  });

export const notesQuery = (username: string) =>
  queryOptions({
    queryKey: ["users", username, "notes"],
    queryFn: () => fetchNotes(username),
  });

export const noteQuery = (params: { username: string; noteId: string }) =>
  queryOptions({
    queryKey: ["users", "notes", params],
    queryFn: () => fetchNote(params),
  });
