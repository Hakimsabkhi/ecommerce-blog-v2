import Blog from '@/components/PostComponents/Post';
import Blogbanner from '@/components/blogbanner';

async function getBlogs() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/listpostcustomer`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 }, // Revalidate every 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const revalidate = 3600; 
export default async function Page() {
  const blogs = await getBlogs();

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
