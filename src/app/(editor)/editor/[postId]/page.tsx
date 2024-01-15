import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/server/auth";
import { api } from "@/trpc/server";
import { type Post, type User } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";
import { Editor } from "@/components/editor";

async function getPostForUser(postId: Post["id"]) {
  return await api.post.get.query({
    id: postId,
  });
}

interface EditorPageProps {
  params: { postId: string };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const post = await getPostForUser(params.postId);

  if (!post) {
    notFound();
  }

  return (
    <Editor
      post={{
        id: post.id,
        title: post.title,
        // @ts-expect-error content should be typed as json
        content: post.content,
        published: post.published,
      }}
    />
  );
}
