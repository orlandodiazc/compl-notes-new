import { InputConform } from "@/components/conform/input";
import { TextareaConform } from "@/components/conform/text-area";
import { ErrorList, Field } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { StatusButton } from "@/components/ui/status-button";
import { Textarea } from "@/components/ui/textarea";
import { putNote } from "@/lib/api";
import { noteQuery } from "@/lib/api/queryOptions";
import { useIsPending } from "@/lib/misc";
import { cn, getNoteImgSrc } from "@/lib/utils";
import {
  FieldMetadata,
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Label } from "@radix-ui/react-label";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { z } from "zod";

const titleMinLength = 1;
const titleMaxLength = 10;
const contentMinLength = 1;
const contentMaxLength = 10000;

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

const ImageFieldsetSchema = z.object({
  id: z.string().optional(),
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB"),
  altText: z.string().optional(),
});

const NoteEditorSchema = z.object({
  title: z.string().min(titleMinLength).max(titleMaxLength),
  content: z.string().min(contentMinLength).max(contentMaxLength),
  images: z.array(ImageFieldsetSchema).max(5).optional(),
});

// repeated loader from note
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
  async ({ request, params }: ActionFunctionArgs) => {
    if (!params.username) {
      throw new Error("No username provided");
    }
    if (!params.noteId) {
      throw new Error("No noteId provided");
    }
    const formData = await request.formData();
    const submission = parseWithZod(formData, { schema: NoteEditorSchema });

    if (submission.status !== "success") {
      return submission.reply();
    }

    await putNote({
      formData,
      params: { username: params.username, noteId: params.noteId },
    });

    await queryClient.invalidateQueries({
      queryKey: noteQuery({ username: params.username, noteId: params.noteId })
        .queryKey,
    });
    return redirect(`/users/${params.username}/notes/${params.noteId}`);
  };

export default function NoteEdit() {
  const params = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;
  const { data: note } = useSuspenseQuery(noteQuery(params));
  const isPending = useIsPending();
  const [form, fields] = useForm({
    id: "note-editor",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: NoteEditorSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      title: note.title,
      content: note.content,
      images: note.images,
    },
  });

  const imageList = fields.images.getFieldList();
  return (
    <div className="absolute inset-0">
      <Form
        method="post"
        className="flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12"
        {...getFormProps(form)}
        encType="multipart/form-data"
      >
        {/* <AuthenticityTokenInput /> */}
        {/*
					This hidden submit button is here to ensure that when the user hits
					"enter" on an input field, the primary form function is submitted
					rather than the first button in the form (which is delete/add image).
				*/}
        <button type="submit" className="hidden" />
        <div className="flex flex-col gap-1">
          <Field>
            <Label htmlFor={fields.title.id}>Title</Label>
            <InputConform meta={fields.title} type="text" />
            <ErrorList id={fields.title.errorId} errors={fields.title.errors} />
          </Field>
          <Field>
            <Label htmlFor={fields.content.id}>Content</Label>
            <TextareaConform meta={fields.content} />
            <ErrorList
              id={fields.content.errorId}
              errors={fields.content.errors}
            />
          </Field>
          <div>
            <Label>Images</Label>
            <ul className="flex flex-col gap-4">
              {imageList.map((image, index) => (
                <li
                  key={image.key}
                  className="relative border-b-2 border-muted-foreground"
                >
                  <button
                    {...form.remove.getButtonProps({
                      name: fields.images.name,
                      index,
                    })}
                    className="text-foreground-destructive absolute right-0 top-0"
                  >
                    <span aria-hidden>
                      <Icon name="x" />
                    </span>{" "}
                    <span className="sr-only">Remove image {index + 1}</span>
                  </button>
                  <ImageChooser meta={image} />
                </li>
              ))}
            </ul>
          </div>
          <Button
            className="mt-3"
            {...form.insert.getButtonProps({
              name: fields.images.name,
              defaultValue: {},
            })}
          >
            <span aria-hidden>
              <Icon name="plus">Image</Icon>
            </span>{" "}
            <span className="sr-only">Add image</span>
          </Button>
        </div>
        <ErrorList id={form.errorId} errors={fields.title.errors} />
      </Form>
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg bg-muted/80 p-4 pl-5 shadow-xl shadow-accent backdrop-blur-sm md:gap-4 md:pl-7 justify-end">
        <Button form={form.id} variant="destructive" type="reset">
          Reset
        </Button>
        <StatusButton
          form={form.id}
          type="submit"
          disabled={isPending}
          status={isPending ? "pending" : "idle"}
        >
          Submit
        </StatusButton>
      </div>
    </div>
  );
}

function ImageChooser({
  meta,
}: {
  meta: FieldMetadata<z.infer<typeof ImageFieldsetSchema>>;
}) {
  const imageFields = meta.getFieldset();
  const existingImage = Boolean(imageFields.id.initialValue);
  const [previewImage, setPreviewImage] = useState<string | null | undefined>(
    imageFields.id.initialValue
      ? getNoteImgSrc(imageFields.id.initialValue)
      : null
  );
  return (
    <fieldset
      aria-invalid={Boolean(meta.errors?.length) || undefined}
      aria-describedby={meta.errors?.length ? meta.errorId : undefined}
    >
      <div className="flex gap-3">
        <div className="w-32">
          <div className="relative h-32 w-32">
            <label
              htmlFor={imageFields.file.id}
              className={cn("group absolute h-32 w-32 rounded-lg", {
                "bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100":
                  !previewImage,
                "cursor-pointer focus-within:ring-4": !existingImage,
              })}
            >
              {previewImage ? (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt={imageFields.altText.value ?? ""}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                  {existingImage ? null : (
                    <div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
                      new
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
                  <Icon name="plus" />
                </div>
              )}
              {existingImage ? (
                <input {...getInputProps(imageFields.id, { type: "hidden" })} />
              ) : null}
              <input
                aria-label="Image"
                className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setPreviewImage(null);
                  }
                }}
                accept="image/*"
                {...getInputProps(imageFields.file, { type: "file" })}
              />
            </label>
          </div>
          <div className="min-h-[32px] px-4 pb-3 pt-1">
            <ErrorList
              id={imageFields.file.errorId}
              errors={imageFields.file.errors}
            />
          </div>
        </div>
        <Field>
          <Label htmlFor={imageFields.altText.id}>Alt Text</Label>
          <Textarea {...getTextareaProps(imageFields.altText)} />
          <ErrorList
            id={imageFields.altText.errorId}
            errors={imageFields.altText.errors}
          />
        </Field>
      </div>
      <div className="min-h-[32px] px-4 pb-3 pt-1">
        <ErrorList id={meta.errorId} errors={meta.errors} />
      </div>
    </fieldset>
  );
}
