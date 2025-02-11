"use client"
import BlogPost from '@/components/Admin/post/BlogPost';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';

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

interface Blog {
  _id:string;
  title: string;
  description: string;
  Postfirstsubsections: Postfirstsubsection[];
  postcategory: postcategory;
  imageUrl?: string;
  user:User;
  numbercomment:number;
  createdAt:string;
}
interface User{
 _id:string;
 username:string
}
interface postcategory {
  _id: string;
  name: string;
}

interface  User{
  _id:string;
  username:string;
  email:string;
}



export default  function Page() {
 
  const { PostSlug} = useParams();
  const id=PostSlug
  const [blog, setBlog] = useState<Blog> ();

useEffect(() => {
  const fetchBlogData = async () => {
    const res = await fetch(`/api/blog/admin/PostBySlugAdmin/${id}`, {
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

    const data = await res.json();
    setBlog(data);
  };
fetchBlogData();

}, [id]);

return (
  <div>
    {blog ? (
      <BlogPost blog={blog} />
    ) : (
      <div className="flex justify-center items-center h-full w-full py-6 pt-96">
                          <FaSpinner className="animate-spin text-[30px]" />
                        </div> // or another appropriate fallback UI
    )}
  </div>
);

}
