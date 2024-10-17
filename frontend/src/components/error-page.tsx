import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  let errorMessage = "";
  console.error(error);
  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = error.detail;
  }

  return (
    <ErrorWrapper>
      <h1 className="text-3xl font-bold">Something went wrong!</h1>
      <p>
        <i>{errorMessage}</i>
      </p>
    </ErrorWrapper>
  );
};

function ErrorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="error-page"
      className="container mx-auto flex h-full w-full items-center justify-center bg-destructive p-20 text-destructive-foreground"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">{children}</div>
        <Link to="/" className="text-body-md underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}
