import { Loader2, Plus, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Editor from "../shared/editor";
import { isEmptyHtml } from "../../lib/utils";
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { getBlogById, updateBlog } from '../../firebase/blogs.actions'; // Import getBlogById and updateBlog

// Define the BlogData interface to match the structure from blogs.actions.ts
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

export default function EditBlogs() {
  const navigate = useNavigate();

  const { blogId } = useParams<{ blogId: string }>(); 
  const [editorContent, setEditorContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(""); 
  const [metaData, setMetaData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;
      setLoading(true);
      try {
        const blog = await getBlogById(blogId);
        if (blog) {
          setEditorContent(blog.editorContent);
          setCoverImage(blog.coverImage);
          setMetaData(blog.metaData);
        } else {
          setError('Blog not found.');
        }
      } catch (err) {
        setError('Failed to fetch blog.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setMetaData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImage = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "burno_s");
    formData.append("folder", "blogs");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/db44hbcwp/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCoverImage(data.secure_url);
      console.log("Uploaded image URL:", data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };
  const handleContentChange = (html: string) => {
    setEditorContent(html);
    console.log('Editor content changed:', html);
  };



  const isDisabled = !coverImage || !editorContent || isEmptyHtml(editorContent);

  const handleUpdate = async () => {
    if (!blogId) {
      console.error("Blog ID is missing.");
      return;
    }
    try {
      const updatedBlogData: Partial<BlogData> = {
        coverImage: coverImage,
        editorContent: editorContent,
        metaData: metaData,
      };
      await updateBlog(blogId, updatedBlogData);
      console.log('Blog updated successfully!');
      navigate('/dashboard/blogs')
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  if (loading) {
    return <div className="h-96 flex items-center justify-center"> <span className="animate-spin"><Loader2 size={16}/></span></div>; 
  }

  if (error) {
    return <div className="h-96 flex items-center justify-center"> <span className="animate-spin"><ShieldAlert size={16}/></span> {error}</div>;; 
  }

  return (
    <>
      <div className="h-20 flex gap-4 border border-pre rounded-md mb-2 px-2 py-1">
        <div className="space-y-1 flex-1">
          <div className="flex gap-2 items-center ">
            <label htmlFor="title ">Title: </label>
            <input
              type="text"
              id="title"
              value={metaData.title}
              onChange={handleInputChange}
              className="border ml-11 border-pre w-full rounded-lg px-2 py-1 focus:outline-none focus:border-[#19001C] transition-colors duration-300"
            />
          </div>

          <div className="flex gap-2 items-center ">
            <label htmlFor="title">Description: </label>
            <input
              type="text"
              id="description"
              value={metaData.description}
              onChange={handleInputChange}
              className="border border-pre w-full rounded-lg px-2 py-1 focus:outline-none focus:border-[#19001C] transition-colors duration-300"
            />
          </div>

        </div>
        <div className="flex-1 flex gap-4">
          <div className="flex-1 flex gap-2">
            <label htmlFor="imgUrl">Cover Image :</label>
            {
              coverImage ? (
                <div className="flex-1 flex-col flex items-center justify-center rounded-xl border border-pre cursor-pointer  hover:bg-[#19001C] transition-colors duration-300">
                  <img src={coverImage} alt="Cover Image" className="w-full h-full object-cover rounded-xl" />
                </div>

              ) : (
                <div className="flex-1 flex-col flex items-center justify-center rounded-xl border border-pre cursor-pointer px-2 py-1  hover:dark:bg-[#19001C] transition-colors duration-300"
                  onClick={() => {
                    if (imgRef.current) {
                      imgRef.current.click();
                    }
                  }}
                >
                  <Plus size={20} />
                  <p className="text-xs text-neutral-400">Click to insert image</p>
                  <input
                    ref={imgRef}
                    type="file"
                    id="imgUrl"
                    className="hidden"
                    onChange={handleImage}
                  />
                </div>
              )
            }
          </div>
          <button
            disabled={isDisabled}
            onClick={handleUpdate}
            className={`
        h-full  rounded-xl text-white flex items-center  justify-center aspect-[4/3]
        ${isDisabled ? 'bg-gray-500 cursor-none' : "bg-purple-950/50 hover:bg-purple-950 cursor-pointer"}
        `}>
            update
          </button>
        </div>
      </div>
      <Editor
       max={620}
        initialValue={editorContent}
        onChange={handleContentChange}
      />
    </>
  )
}
