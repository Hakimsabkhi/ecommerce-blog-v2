import Link from 'next/link';
import React from 'react'
import PostCategory from './PostCategory';
interface postCategory{
    _id:string;
    name:string;
    slug:string;
}
const fetchBlogCategories = async (): Promise<postCategory[]> => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/PostCategory/getAllCategoryF`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
        next: { revalidate: 0 }, // Disable caching
    });

    if (!res.ok) {
        throw new Error('Categories not found');
    }
    const data: postCategory[] = await res.json();
    return data;
};
export default async function Blogright ()  {
    const postCategorys= await fetchBlogCategories()
  return (
    <div className='w-[300px] flex flex-col gap-10 max-lg:hidden'>
    <div className='flex flex-col gap-4'>
        <p className='text-4xl font-bold'>Search</p>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full block p-2.5" placeholder="Search..." required />
    </div>
    {postCategorys &&    <div className='flex flex-col gap-4'>
        <p className='text-4xl font-bold'>Categories</p>
        {postCategorys.map((postCategory, index) =>(    <div key={index} className='flex flex-col gap-2'>
       <Link href={`/blog/${postCategory.slug}`}>
        <p className='text-blue-600 underline cursor-pointer'>{postCategory.name}</p>
        </Link>
           
        </div>))}
    </div>}
        <PostCategory/>
    </div>
  )
}

