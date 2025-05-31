import React, { useEffect, useState } from 'react';
import { getBlogs, deleteBlog } from '../../firebase/blogs.actions';
import { Link } from 'react-router-dom';
import { Edit, Loader2, ShieldAlert, Trash2 } from 'lucide-react';

interface BlogData {
  id: string;
  coverImage: string | null;
  editorContent: any;
  metaData: {
    title: string;
    description: string;
  };
  createdAt?: Date;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsList = await getBlogs();
        setBlogs(blogsList);
      } catch (err) {
        setError('Failed to fetch blogs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (confirm) {
      try {
        await deleteBlog(id);
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      } catch (err) {
        console.error("Failed to delete blog:", err);
        alert("Failed to delete blog.");
      }
    }
  };

  if (loading) {
    return <div className="h-96 flex items-center justify-center"><span className="animate-spin"><Loader2 size={16} /></span></div>;
  }

  if (error) {
    return <div className="h-96 flex items-center justify-center"><ShieldAlert size={16} className="mr-2" />{error}</div>;
  }

  return (
    <main className='overflow-y-scroll no-scrollbar'>
      <div className="flex items-center justify-end py-2 px-2 sticky z-10 rounded-lg bg-[#ffffff] dark:bg-[#19001c] top-0 border-pre border ">
        <Link to={'/dashboard/create-blog'} className="py-2 px-12 rounded-3xl bg-purple-950/50 hover:bg-purple-950 text-white">
          Create
        </Link>
      </div>
      <section className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 mt-4">
        {blogs.map((blog) => (
          <div className="group flex-col rounded-xl border border-pre w-full relative" key={blog.id}>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
              <Link to={`/dashboard/edit-blog/${blog?.id}`} className="p-2 flex rounded-md bg-purple-400 dark:bg-purple-950 cursor-pointer">
                <Edit className="h-4 w-4 text-white" />
              </Link>
              <button onClick={() => handleDelete(blog.id)} className="p-2 flex rounded-md bg-red-500 cursor-pointer">
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            </div>
            <img className="w-full h-54 object-cover rounded-t-xl" src={blog?.coverImage!} alt="" />
            <div className="space-y-2 mt-2 px-2 pb-4">
              <p className="text-2xl font-semibold">{blog?.metaData?.title}</p>
              <p className="text-base line-clamp-2">{blog?.metaData?.description}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Blogs;
