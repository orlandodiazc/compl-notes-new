import { useDebounce } from "@/lib/misc";
import { useId } from "react";
import { Form, useSearchParams, useSubmit } from "react-router-dom";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const SearchBar = ({
  autoFocus = false,
  autoSubmit = false,
}: {
  autoFocus?: boolean;
  autoSubmit?: boolean;
}) => {
  const id = useId();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const handleFormChange = useDebounce((form: HTMLFormElement) => {
    submit(form);
  }, 400);

  return (
    <Form
      method="GET"
      action="/users"
      className="flex flex-wrap items-center justify-center gap-2"
      onChange={(e) => autoSubmit && handleFormChange(e.currentTarget)}
    >
      <div className="flex-1">
        <Label htmlFor={id} className="sr-only">
          Search
        </Label>
        <Input
          type="search"
          name="search"
          id={id}
          defaultValue={searchParams.get("search") ?? ""}
          placeholder="Search"
          className="w-full"
          autoFocus={autoFocus}
        />
      </div>
      <div>
        <Button
          type="submit"
          className="flex w-full items-center justify-center"
          size="sm"
        >
          <Icon name="search" size="sm" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </Form>
  );
};
