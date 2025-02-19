import Blog from '@/components/Client/Post/Post';
import Blogbanner from '@/components/Client/Post/blogbanner';
import { getBlogs } from '@/lib/StaticDataBlog';


export const revalidate = 3600; 
export default async function Page() {
  const rawblogs = await getBlogs();
  const blogs=JSON.parse(rawblogs)

  return (
    <div>
      <Blogbanner />
      {blogs.length === 0 ? (
        <div>No blogs available at the moment. Please check back later.</div>
      ) : (
        <Blog blogs={blogs} />
      )}
    </div>
  );
}
