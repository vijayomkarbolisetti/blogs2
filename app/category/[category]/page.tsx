"use client"; // ✅ Ensures this is a Client Component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { client } from "@/app/lib/sanity";
import Header from "@/app/components/Header";

// ✅ Define the structure of a Post (Fix TypeScript error)
interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: { asset?: { url?: string } };
  category?: { title: string };
}

// ✅ Explicitly typed `category` & return type
async function getCategoryPosts(category: string): Promise<Post[]> {
  console.log("🚀 Fetching posts for category:", category);

  try {
    // Fetch category data from Sanity
    const categoryData = await client.fetch(
      `*[_type == "category" && title == $category][0]`,
      { category }
    );

    if (!categoryData) {
      console.log("❌ No matching category found!");
      return [];
    }

    console.log("✅ Found Category ID:", categoryData._id);

    // Fetch posts that belong to this category
    const query = `*[_type == "post" && category._ref == $categoryId] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      mainImage{
        asset->{url}
      },
      category->{
        title
      }
    }`;

    console.log("🛠 Running Query for Category ID:", categoryData._id);

    const posts: Post[] = await client.fetch(query, { categoryId: categoryData._id });

    console.log("✅ Fetched Posts for", category, ":", posts);
    return posts;
  } catch (error) {
    console.error("❌ Sanity Fetch Error:", error);
    return [];
  }
}

export default function CategoryPage() {
  const params = useParams(); // ✅ Get params first
  const category = typeof params.category === "string" ? params.category : ""; // ✅ Ensure it's a string
  const [posts, setPosts] = useState<Post[]>([]); // ✅ Set type for `posts`

  useEffect(() => {
    console.log("📡 Received Category from URL:", category);

    if (!category) {
      console.log("❌ Invalid category parameter!");
      return;
    }

    async function fetchPosts() {
      const fetchedPosts = await getCategoryPosts(category);
      setPosts(fetchedPosts);
    }

    fetchPosts();
  }, [category]);

  console.log("📜 Posts in State:", posts);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 mt-6">
        <h1 className="text-3xl font-bold text-center text-black">
          {category ? category.toUpperCase() : "Unknown"} News
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="bg-white p-4 rounded-lg shadow-lg text-black">
                <Link href={`/news/${post.slug.current}`}>
                  <img
                    src={post.mainImage?.asset?.url || "/placeholder.jpg"}
                    alt={post.title}
                    className="w-full h-60 object-cover rounded-md transition-transform hover:scale-105"
                  />
                  <h2 className="mt-4 text-xl font-bold text-gray-800 hover:text-red-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              No news found in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
