
import React from 'react';


import Blogcomp from './Postcomp/Postcomp';
import Blogcomment from './Postcomp/Postcomment';
import Blogright from './Postcomp/Postright';

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
 username:string
}
interface blogCategory {
  _id: string;
  name: string;
}

interface  User{
  _id:string;
  username:string;
  email:string;
}

  interface blogprops{
    blog:blog
  }
const BlogPost: React.FC<blogprops> = ({ blog }) => {
    return (
        /* whole page */
        <div className="desktop flex py-8 max-lg:py-20 gap-10 ">
            {/* First Half */}
            <div className='w-[900px] max-lg:w-full flex flex-col gap-16'>
                {/* 1 */}
                <Blogcomp blog={blog}/>
                {/* 2 */}
               <Blogcomment blog={blog}/>
            </div>
            {/* Second Half */}
            <Blogright/>
        </div>
    );
};

export default BlogPost;
