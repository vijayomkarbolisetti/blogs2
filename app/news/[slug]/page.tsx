"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client } from "@/app/lib/sanity";
import Header from "@/app/components/Header";
import Link from "next/link";
import SocialMediaShare from "@/app/components/SocialMedia";

async function getPost(slug) {
  try {
    console.log("🔍 Original Slug:", slug);
    const decodedSlug = decodeURIComponent(slug); // ✅ Fix: Decode slug before querying
    console.log("✅ Decoded Slug:", decodedSlug);

    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        title,
        body,
        publishedAt,
        mainImage{
          asset->{url}
        },
        category->{
          title
        },
        author->{
          name,
          bio,
          image{
            asset->{url}
          }
        }
      }`,
      { slug: decodedSlug } 
    );

    console.log("✅ Fetched post data:", post);
    return post;
  } catch (error) {
    console.error("❌ Sanity Fetch Error:", error);
    return null;
  }
}

async function getRelatedPosts(category, slug) {
  try {
    const decodedSlug = decodeURIComponent(slug); // ✅ Decode slug
    const relatedPosts = await client.fetch(
      `*[_type == "post" && category->title == $category && slug.current != $slug] | order(publishedAt desc) {
        title,
        slug,
        publishedAt,
        mainImage{
          asset->{url}
        }
      }`,
      { category, slug: decodedSlug }
    );

    console.log("✅ Fetched related posts:", relatedPosts);
    return relatedPosts;
  } catch (error) {
    console.error("❌ Sanity Fetch Error:", error);
    return [];
  }
}

export default function NewsPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (!slug) return; 

    async function fetchData() {
      const currentPost = await getPost(slug);
      if (!currentPost) {
        console.error("⚠️ No post found for slug:", slug);
        return;
      }

      setPost(currentPost);

      if (currentPost?.category?.title) {
        const relatedPosts = await getRelatedPosts(currentPost.category.title, slug);
        setRelatedPosts(relatedPosts);
      }
    }

    fetchData();
  }, [slug]);

  if (!post) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      <Header />
      <div className="container mx-auto px-4 md:px-10 lg:px-16 mt-8 flex justify-center">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-full max-w-3xl">
      
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            {post.title || "Untitled Post"}
          </h1>

       
          <p className="text-gray-500 text-sm text-left mt-2">
            Published on:{" "}
            <span className="font-medium">
              {post.publishedAt ? new Date(post.publishedAt).toDateString() : "Unknown Date"}
            </span>
          </p>

        
          <div className="mt-6 flex justify-center">
            <img
              src={post.mainImage?.asset?.url || "/placeholder.jpg"}
              alt={post.title || "Post Image"}
              className="w-96 h-52 object-cover rounded-md shadow-lg mx-auto"
            />
          </div>

  
          {post.author && (
            <div className="flex items-center space-x-4 p-4 rounded-lg">
              <img
                src={post.author.image?.asset?.url || "/placeholder.jpg"}
                alt={post.author.name || "Author"}
                className="w-14 h-14 object-cover rounded-full border-2 border-gray-300"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {post.author.name || "Unknown Author"}
                </h3>
                <p className="text-gray-600 text-sm">{post.author.bio || "No bio available."}</p>
              </div>
            </div>
          )}

          <div className="mt-6 text-gray-700 leading-relaxed">
            {post.body ? (
              <PortableText value={post.body} />
            ) : (
              <p className="text-red-500">No content available.</p>
            )}
          </div>

          <div className="mt-6">
            <SocialMediaShare postTitle={post.title} postUrl={`http://localhost:3000/news/${slug}`} />
          </div>
        </div>
      </div>

      {/* ✅ Related Posts */}
      <div className="container mx-auto px-4 md:px-10 lg:px-16 mt-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Related News in {post.category?.title || "Unknown Category"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {relatedPosts.length > 0 ? (
            relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.slug.current} href={`/news/${relatedPost.slug.current}`}>
                <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
                  <img
                    src={relatedPost.mainImage?.asset?.url || "/placeholder.jpg"}
                    alt={relatedPost.title}
                    className="w-full h-40 object-cover rounded-md transition-transform hover:scale-105"
                  />
                  <div className="flex-grow flex flex-col">
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 min-h-[56px]">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-auto">
                      Published on: {new Date(relatedPost.publishedAt).toDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600">No related posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
