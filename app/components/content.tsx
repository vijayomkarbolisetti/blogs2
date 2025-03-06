"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { client } from "../lib/sanity";

async function getCategoriesWithPosts() {
  try {
    const query = `
      {
        "categories": *[_type == "category"]{ _id, title },
        "posts": *[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          publishedAt,
          mainImage{
            asset->{url}
          },
          category->{title}
        }
      }
    `;
    const { categories, posts } = await client.fetch(query);

    const categorizedPosts = {};
    categories.forEach((category) => {
      categorizedPosts[category.title] = posts.filter(
        (post) => post.category?.title === category.title
      );
    });

    return { categories, categorizedPosts };
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return { categories: [], categorizedPosts: {} };
  }
}

export default function Content() {
  const [data, setData] = useState({ categories: [], categorizedPosts: {} });
  const [expandedCategories, setExpandedCategories] = useState({}); 

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await getCategoriesWithPosts();
      setData(fetchedData);
    }
    fetchData();
  }, []);

  const toggleViewMore = (categoryTitle) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle],
    }));
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-center text-black">
        News by Category
      </h1>

      {data.categories.map((category) => {
        const categoryPosts = data.categorizedPosts[category.title] || [];
        if (categoryPosts.length === 0) return null;

        const showAll = expandedCategories[category.title];
        const displayedPosts = showAll
          ? categoryPosts
          : categoryPosts.slice(0, 4);

        return (
          <div key={category._id} className="p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {category.title}
              </h2>
              {categoryPosts.length > 4 && (
                <Link
                  href={`/category/${category.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  View More →
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
              {displayedPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/news/${post.slug.current}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-transform">
                    <img
                      src={post.mainImage?.asset?.url || "/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-40 object-cover transition-transform hover:scale-105"
                    />

                    <div className="p-3 flex flex-col justify-between flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-red-600 transition line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
