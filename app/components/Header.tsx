"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { client } from "../lib/sanity";
import logo from "../../public/anveshana.png";
import Image from "next/image";

async function getCategoriesAndAuthors() {
  try {
    const query = `
      {
        "categories": *[_type == "category"]{ _id, title },
        "authors": *[_type == "author"]{ _id, name }
      }
    `;
    return await client.fetch(query);
  } catch (error) {
    console.error("Sanity Fetch Error:", error);
    return { categories: [], authors: [] };
  }
}

export default function Header() {
  const [data, setData] = useState({ categories: [], authors: [] });

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await getCategoriesAndAuthors();
      setData(fetchedData);
    }
    fetchData();
  }, []);

  return (
    <header className="bg-white shadow-md h-16 flex items-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
   
        <Link href="/" className="font-bold text-red-600 cursor-pointer">
  <Image 
    src={logo} 
    alt="Anveshana" 
  
    className="h-32 w-auto" 
  />
</Link>



        <nav className="md:mt-0">
          <ul className="flex gap-6 text-lg font-medium text-gray-700">
            <li className="relative group">
              <button className="hover:text-red-600 px-3 py-2"> Categories </button>
              <ul className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 py-1 max-h-48 overflow-auto">
                {data.categories.map((category) => (
                  <li key={category._id}>
                    <Link
                      href={`/category/${category.title.toLowerCase()}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
