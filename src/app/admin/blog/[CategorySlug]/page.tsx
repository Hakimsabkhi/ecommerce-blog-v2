"use client";

import Blog from '@/components/Admin/post/Post'
import { notFound, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchBlogData = async () => {
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
    };
fetchBlogData();
    
  }, [id]);

  return (
    <div>
      {/* Ensure you're passing blogs here */}
      <Blog blogs={blogs} />
    </div>
  );
}
