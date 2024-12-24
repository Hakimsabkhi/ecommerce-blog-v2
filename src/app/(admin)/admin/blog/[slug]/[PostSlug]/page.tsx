"use server"
import BlogPost from '@/components/fPostadmin/BlogPost';
import { notFound } from 'next/navigation';
import React from 'react';
interface Postsecondsubsection {
  secondtitle: string;
  description: string;
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface Postfirstsubsection {
  fisttitle: string;
  description: string;
  Postsecondsubsections: Postsecondsubsection[];
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface blog {
  title: string;
  description: string;
  Postfirstsubsections: Postfirstsubsection[];
  blogCategory: blogCategory;
  imageUrl?: string;
  user:User;
  createdAt:string;
}
interface User{
 _id:string;
 username:string
}
interface blogCategory {
  _id: string;
  name: string;
}

interface blogCategory{
  _id:string
  name:string
}

const fetchBlogData = async (id: string): Promise<blog> => {
  
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/PostBySlugAdmin/${id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 }, // Disable caching
      });
  
      if (!res.ok) {
        notFound();
      }
  
      const data: blog = await res.json();
    
      return data;
    
  };
  
  export default async function Page({ params }: { params: {PostSlug: string } }) {

    const {PostSlug:id} = await params;
    // Early return if no product id
    if (!id) {
      return notFound();
    }

    const blog = await fetchBlogData(id);
    
   
    return (
        <div>
            <BlogPost blog={blog} />
        </div>
    );
}


