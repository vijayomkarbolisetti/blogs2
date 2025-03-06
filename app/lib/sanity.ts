import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!, 
  apiVersion: "2023-05-03", 
  useCdn: process.env.NODE_ENV === "production", 
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source).auto("format").fit("max"); 
}

export async function getPosts() {
  try {
    const posts = await client.fetch(`*[_type == "post"]{
      _id,
      title,
      slug,
      publishedAt,
      mainImage{
        asset->{url}
      }
    }`);
    return posts;
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return [];
  }
}

export async function getPost(slug: string) {
  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        publishedAt,
        body,
        mainImage{
          asset->{url}
        }
      }`, 
      { slug }
    );
    return post;
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return null;
  }
}
