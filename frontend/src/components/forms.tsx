export const Field = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

type ListOfErrors = Array<string | null | undefined> | null | undefined;

export const ErrorList = ({
  id,
  errors,
}: {
  errors?: ListOfErrors;
  id?: string;
}) => {
  const errorsToRender = errors?.filter(Boolean);
  if (!errorsToRender?.length) return null;
  return (
    <ul id={id} className="flex flex-col gap-1">
      {errorsToRender.map((e) => (
        <li key={e} className="text-foreground-destructive text-[10px]">
          {e}
        </li>
      ))}
    </ul>
  );
};
