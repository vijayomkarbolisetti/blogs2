import { client } from "@/app/lib/sanity";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

// ✅ Correctly typed Next.js PageProps
type PageProps = {
  params: { slug: string };
};

// ✅ Fetch post data on the server
async function getPost(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        "formattedPublishedAt": publishedAt,
        mainImage{ asset->{url} },
        body
      }`,
      { slug }
    );
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return null;
  }
}

// ✅ Server Component with Correct Types
export default async function PostPage({ params }: PageProps) {
  // ✅ Ensure params are valid
  if (!params?.slug || typeof params.slug !== "string") {
    return notFound();
  }

  const post = await getPost(params.slug);
  if (!post) return notFound(); // ✅ Ensure post exists before rendering

  return (
    <div>
      <h1>{post.title}</h1>
      {post.mainImage?.asset?.url && (
        <img src={post.mainImage.asset.url} alt={post.title} width="800" />
      )}
      <p>Published on: {post.formattedPublishedAt}</p>
      <div>
        <PortableText value={post.body} />
      </div>
    </div>
  );
}

// ✅ Generate static paths (Fixes deployment errors)
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  return slugs.map((post: { slug: string }) => ({ slug: post.slug }));
}
