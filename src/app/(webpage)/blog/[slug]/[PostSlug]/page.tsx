import BlogPost from '@/components/fPost/BlogPost';
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
  _id:string;
  title: string;
  description: string;
  Postfirstsubsections: Postfirstsubsection[];
  blogCategory: blogCategory;
  imageUrl?: string;
  user:User;
  numbercomment:number;
  createdAt:string;
}
interface User{
 _id:string;
 username:string;
 email:string;
}
interface blogCategory {
  _id: string;
  name: string;

}



const fetchBlogData = async (id: string): Promise<blog> => {
  
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/postbyslugCustomer/${id}`, {
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
    const id = params?.PostSlug;

 
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


