import Cookies from "js-cookie";
import { ApiSchema } from "./apiSchema";

export const API_BASE_URL = "http://localhost:8080";

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getCsrfTokenCookie():
  | Record<"X-XSRF-TOKEN", string>
  | Record<string, never> {
  const token = Cookies.get("XSRF-TOKEN");
  if (!token) return {};
  return { "X-XSRF-TOKEN": token };
}

export async function fetcher(...args: Parameters<typeof fetch>) {
  // await sleep(1000);
  const [url, opts] = args;
  const response = await fetch(`${API_BASE_URL}${url}`, opts);
  let data;
  try {
    data = await response.json();
  } catch {
    console.error(response);
    throw response;
  }
  if (!response.ok) throw data;
  return data;
}

export function fetchFilteredUsers(
  searchTerm?: string
): Promise<ApiSchema["UserFilteredResponse"][]> {
  return fetcher("/users?" + new URLSearchParams({ search: searchTerm ?? "" }));
}

export function fetchUser(
  username: string
): Promise<ApiSchema["UserSummaryResponse"]> {
  return fetcher("/users/" + username);
}

export function fetchNotes(
  username: string
): Promise<ApiSchema["UserNotesResponse"]> {
  return fetcher("/users/" + username + "/notes");
}

export function fetchNote({
  username,
  noteId,
}: {
  username: string;
  noteId: string;
}): Promise<ApiSchema["NoteSummaryResponse"]> {
  return fetcher("/users/" + username + "/notes/" + noteId);
}

export async function deleteNote({
  username,
  noteId,
}: {
  username: string;
  noteId: string;
}) {
  const response = await fetch(
    API_BASE_URL + "/users/" + username + "/notes/" + noteId,
    {
      method: "DELETE",
      credentials: "include",
      headers: getCsrfTokenCookie(),
    }
  );
  if (!response.ok) throw response;
}

export function putNote({
  params: { username, noteId },
  formData,
}: {
  params: { username: string; noteId: string };
  formData: FormData;
}) {
  return fetcher("/users/" + username + "/notes/" + noteId, {
    method: "PUT",
    body: formData,
    credentials: "include",
    headers: getCsrfTokenCookie(),
  });
}
