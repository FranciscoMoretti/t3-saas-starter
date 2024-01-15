"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Post } from "@prisma/client";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import type * as z from "zod";

import "@/styles/editor.css";
import { api } from "@/trpc/react";

import { cn } from "@/lib/utils";
import { postPatchSchema } from "@/lib/validations/post";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";

interface EditorProps {
  post: Pick<Post, "id" | "title" | "content" | "published">;
}

type FormData = z.infer<typeof postPatchSchema>;

export function Editor({ post }: EditorProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  });
  const ref = React.useRef<EditorJS>();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const updatePost = api.post.update.useMutation({
    onSuccess: (data) => {
      // Should invalidate the queryKey that loads posts
      toast({
        description: "Your post has been saved.",
      });
      setIsSaving(false);
      router.refresh();
    },
    onError: () => {
      setIsSaving(false);
      toast({
        title: "Something went wrong.",
        description: "Your post was not saved. Please try again.",
        variant: "destructive",
      });
      router.refresh();
    },
  });

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // @ts-expect-error import
    const Header = (await import("@editorjs/header")).default;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // @ts-expect-error import
    const Embed = (await import("@editorjs/embed")).default;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // @ts-expect-error import
    const Table = (await import("@editorjs/table")).default;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // @ts-expect-error import
    const List = (await import("@editorjs/list")).default;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // @ts-expect-error import
    const Code = (await import("@editorjs/code")).default;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // @ts-expect-error import
    const LinkTool = (await import("@editorjs/link")).default;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // @ts-expect-error import
    const InlineCode = (await import("@editorjs/inline-code")).default;

    const body = postPatchSchema.parse(post);

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: body.content,
        tools: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          header: Header,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          linkTool: LinkTool,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          list: List,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          code: Code,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          inlineCode: InlineCode,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          table: Table,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          embed: Embed,
        },
      });
    }
  }, [post]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      void initializeEditor();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    const blocks = await ref.current?.save();

    updatePost.mutate({
      id: post.id,
      title: data.title,
      content: blocks,
    });
  }

  if (!isMounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
            <p className="text-sm text-muted-foreground">
              {post.published ? "Published" : "Draft"}
            </p>
          </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </div>
        <div className="prose prose-stone mx-auto w-[800px] dark:prose-invert">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post.title}
            placeholder="Post title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            {...register("title")}
          />
          <div id="editor" className="min-h-[500px]" />
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </div>
    </form>
  );
}
