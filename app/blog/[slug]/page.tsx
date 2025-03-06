import { client } from "@/app/lib/sanity";

interface PageProps {
  params: { slug: string };
}

// ✅ Fetch post data
async function getPost(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        publishedAt,
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
  const post = await getPost(params.slug);

  if (!post) {
    return <div><h1>Post Not Found</h1></div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      {post.mainImage?.asset?.url && (
        <img src={post.mainImage.asset.url} alt={post.title} width="800" />
      )}
      <p>Published on: {new Date(post.publishedAt).toDateString()}</p>
      <div>
        {post.body?.map((block: any, index: number) => (
          <p key={index}>{block?.children?.[0]?.text || ""}</p>
        ))}
      </div>
    </div>
  );
}

// ✅ Generate static paths (Important for pre-rendering)
export async function generateStaticParams() {
  const slugs = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  return slugs.map((post: { slug: string }) => ({ slug: post.slug }));
}
