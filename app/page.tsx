"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { client } from "./lib/sanity";
import Header from "./components/Header";
import Content from "./components/content";
import HoverableCategory from "./components/Hoverable";

// ✅ Define TypeScript Interfaces
interface Category {
  _id: string;
  title: string;
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: { asset?: { url?: string } };
  category?: { _id?: string; title?: string };
}

interface CategorizedPosts {
  [categoryTitle: string]: Post[];
}

// ✅ Fetch posts with type safety
async function getPosts(): Promise<Post[]> {
  try {
    return await client.fetch(
      `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        mainImage{
          asset->{url}
        },
        category->{
          _id,
          title
        }
      }`
    );
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return [];
  }
}

// ✅ Fetch categories with type safety
async function getCategories(): Promise<Category[]> {
  try {
    return await client.fetch(
      `*[_type == "category"]{
        _id,
        title
      }`
    );
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return [];
  }
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorizedPosts, setCategorizedPosts] = useState<CategorizedPosts>({});

  // ✅ Optimized Fetching with useCallback
  const fetchData = useCallback(async () => {
    const fetchedPosts = await getPosts();
    const fetchedCategories = await getCategories();

    setPosts(fetchedPosts);
    setCategories(fetchedCategories);

    // ✅ Organize posts by category
    const postsByCategory: CategorizedPosts = {};
    fetchedPosts.forEach((post) => {
      if (post.category?.title) {
        if (!postsByCategory[post.category.title]) {
          postsByCategory[post.category.title] = [];
        }
        postsByCategory[post.category.title].push(post);
      }
    });

    setCategorizedPosts(postsByCategory);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <div className="container mx-auto mt-6 px-4">
        <h1 className="text-2xl font-bold text-center text-black mb-6">
          Latest News
        </h1>

        {/* ✅ Display Hoverable Categories */}
        <div className="flex space-x-4 overflow-x-auto p-2 relative z-50">
          {categories.length > 0 ? (
            categories.map((category) => (
              <HoverableCategory
                key={category._id}
                category={category}
                categorizedPosts={categorizedPosts}
              />
            ))
          ) : (
            <p className="text-gray-500">No categories found.</p>
          )}
        </div>

        {/* ✅ Latest Updates */}
        {posts.length > 2 && (
          <div className="bg-white p-4 rounded-lg shadow-lg mb-6 overflow-hidden">
            <h3 className="text-xl font-semibold border-b pb-2 text-red-600">
              📢 Latest Updates
            </h3>
            <div className="relative overflow-hidden whitespace-nowrap mt-3">
              <div className="marquee inline-flex animate-marquee">
                {posts.slice(0, 5).map((post) => (
                  <Link
                    key={post._id}
                    href={`/news/${post.slug.current}`}
                    className="text-gray-800 hover:text-red-600 transition font-semibold mx-6"
                  >
                    📢 {post.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ✅ Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-lg">
            {posts.length > 0 && (
              <Link href={`/news/${posts[0].slug.current}`}>
                <img
                  src={posts[0].mainImage?.asset?.url || "/placeholder.jpg"}
                  alt={posts[0].title}
                  className="w-full h-80 object-cover rounded-md"
                />
                <h2 className="mt-4 text-2xl font-bold text-gray-800 hover:text-red-600 transition-colors">
                  {posts[0].title}
                </h2>
              </Link>
            )}
          </div>
          <div className="bg-white text-black p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold border-b pb-2 text-red-600">
              📢 తాజా వార్తలు
            </h3>
            <ul className="mt-3 space-y-3">
              {posts.length > 1 ? (
                posts.slice(1, 6).map((post) => (
                  <li
                    key={post._id}
                    className="flex items-center gap-3 border-b pb-2 hover:bg-gray-100 transition"
                  >
                    <Link
                      href={`/news/${post.slug.current}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={post.mainImage?.asset?.url || "/placeholder.jpg"}
                        alt={post.title}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                      <span className="text-gray-700 hover:text-red-600 transition">
                        {post.title}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No additional news.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
      <Content />

      {/* ✅ Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
