"use client";

import { flag } from '@/assets/image';
import Blog from '@/components/Admin/post/Post'
import { notFound, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa6';


interface Blog {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  postcategory: { slug: string };
  vadmin: string;
  createdAt: string;
}


export default function Page() {
    const { CategorySlug} = useParams();
    const id=CategorySlug
      
    
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBlogData = async () => {
      try{
      const res = await fetch(`/api/blog/admin/PostBySlugCategoryAdmin/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        notFound();
        return;
      }

      const data: Blog[] = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blog data:", error);
      // Optionally, you could set an error state here to display a message to the user
    }finally{
setLoading(false);
    }
  }
fetchBlogData();
    
  }, [id]);

  return (
    <div>
      {/* Ensure you're passing blogs here */}
     {loading? (
          <div className="flex justify-center items-center h-full w-full py-6 pt-96">
                              <FaSpinner className="animate-spin text-[30px]" />
                            </div> // or another appropriate fallback UI
        ):(
          <Blog blogs={blogs} />
        )}
    </div>
  );
}
