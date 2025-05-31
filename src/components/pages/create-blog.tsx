import { useEffect, useRef, useState } from "react";
import Editor from "../shared/editor";
import { Plus } from "lucide-react";
import { createBlog } from "../../firebase/blogs.actions";
import { isEmptyHtml } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const navigate = useNavigate();

  const [metaData, setMetaData] = useState({
    title: "",
    description: "",
  });
  const [editorContent, setEditorContent] = useState('<p>Initial content goes here!</p>');
  const [coverImage, setCoverImage] = useState<any>("");

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
      setCoverImage(data.secure_url); // Now coverImage is a real Cloudinary URL
      console.log("Uploaded image URL:", data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };
  const handleContentChange = (html: string) => {
    setEditorContent(html);
    console.log('Editor content changed:', html);
  };
  useEffect(() => {
    console.log('Editor content changed:', editorContent);
  }, [editorContent]);
  const imgRef = useRef<HTMLInputElement>(null);



  const isDisabled = !coverImage || !editorContent || isEmptyHtml(editorContent);

  const handleSubmit = async () => {
    try {
      const blogData = {
        coverImage: coverImage,
        editorContent: editorContent,
        metaData: metaData,
      };
      const blogId = await createBlog(blogData);
      console.log('Blog created with ID:', blogId);
      if (blogId) {
        navigate('/dashboard/blogs')
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };
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
                <div className="flex-1 flex-col flex items-center justify-center rounded-xl border border-pre cursor-pointer px-2 py-1 hover:dark:bg-[#19001C] transition-colors duration-300"
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
            onClick={handleSubmit}
            className={`
        h-full  rounded-xl flex text-white items-center  justify-center aspect-[4/3]
        ${isDisabled ? 'bg-gray-500 cursor-none' : "bg-purple-950/50 hover:bg-purple-950 cursor-pointer"}
        `}>
            save
          </button>
        </div>
      </div>
      <div className="">
        <Editor
          max={620}
          initialValue={editorContent}
          onChange={handleContentChange}
        />
      </div>
    </>
  )
}
