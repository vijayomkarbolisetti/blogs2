"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react"; // Import dropdown icon

const HoverableCategory = ({ category, categorizedPosts }) => {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState(null);

  if (!category || !category.title) {
    return null;
  }

  const handleMouseEnter = (event) => {
    setHovered(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left,
      width: rect.width,
    });
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!document.querySelector(".hover-card:hover")) {
        setHovered(false);
      }
    }, 100);
  };

  return (
    <div className="relative inline-block">
      <span
        className={`cursor-pointer px-4 py-2 rounded-md font-semibold flex items-center gap-1 transition ${
          hovered ? "bg-red-600 text-white" : "bg-gray-200 text-black hover:bg-gray-300"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {category.title}
        <ChevronDown size={16} className={`transition-transform ${hovered ? "rotate-180" : ""}`} />
      </span>
      {hovered && position && (
        <div
          className="hover-card fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            minWidth: "500px",
            maxWidth: "80vw",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <h3 className="text-xl font-semibold border-b pb-2 text-red-600 mb-3">
            📢 {category.title} - Latest Stories
          </h3>
          {categorizedPosts[category.title]?.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto">
              {categorizedPosts[category.title].slice(0, 6).map((post) => (
                <Link key={post._id} href={`/news/${post.slug.current}`} className="group">
                  <div className="w-48 bg-gray-100 p-3 rounded-lg shadow-md hover:bg-gray-200 transition">
                    <img
                      src={post.mainImage?.asset?.url || "/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-28 object-cover rounded-md"
                    />
                    <h4 className="mt-2 text-sm font-medium text-gray-800 group-hover:text-red-600 transition line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-2">No stories in this category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HoverableCategory;
