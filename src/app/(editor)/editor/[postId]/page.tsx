import { notFound, redirect } from "next/navigation";
import { type Post, type User } from "@prisma/client";

import { authOptions } from "@/server/auth";
import { getCurrentUser } from "@/lib/session";
import { Editor } from "@/components/editor";
import { api } from "@/trpc/server";

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
        content: post.content,
        published: post.published,
      }}
    />
  );
}
