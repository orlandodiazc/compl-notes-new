import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Index from "./routes";
import Notes, { loader as notesLoader } from "./routes/notes";
import EditNote, {
  action as editNoteAction,
  loader as editNoteLoader,
} from "./routes/notes/edit";
import Note, {
  action as noteAction,
  loader as noteLoader,
} from "./routes/notes/note";
import NoteIndex from "./routes/notes/note-index";
import Root from "./routes/root";
import Users, { loader as usersLoader } from "./routes/users";
import User, { loader as userLoader } from "./routes/users/user";
import { ErrorPage } from "./components/error-page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "users",
            element: <Users />,
            loader: usersLoader(queryClient),
          },
          {
            path: "users/:username",
            element: <User />,
            loader: userLoader(queryClient),
          },
          {
            path: "users/:username/notes/",
            element: <Notes />,
            loader: notesLoader(queryClient),
            children: [
              {
                errorElement: <ErrorPage />,
                children: [
                  { index: true, element: <NoteIndex /> },
                  {
                    path: ":noteId",
                    element: <Note />,
                    loader: noteLoader(queryClient),
                    action: noteAction(queryClient),
                  },
                  {
                    path: ":noteId/edit",
                    element: <EditNote />,
                    loader: editNoteLoader(queryClient),
                    action: editNoteAction(queryClient),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
