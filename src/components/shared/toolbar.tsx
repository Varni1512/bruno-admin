import React, { useRef } from 'react'
import {
  Bold,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  ImageIcon,
} from 'lucide-react'
import { Editor } from '@tiptap/react'

interface ToolbarProps {
  editor: Editor
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) return null

  const buttonStyle = (active: boolean) =>
    `rounded-md p-1 transition ${active ? 'bg-purple-600 text-white' : 'bg-white text-black'
    }`
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "burno_s");
    formData.append("folder", "blogs");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dsui8rnwc/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        console.log("Uploaded image URL:", data.secure_url);
        editor.chain().focus().setImage({ src: data.secure_url }).run();
      } else {
        console.error("Upload failed: No secure_url returned", data);
      }
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  return (
    <div className="flex relative z-20 flex-wrap items-center gap-1 px-2 py-1 border border-pre rounded-md mb-2 bg-purple-400 dark:bg-[#19001c]">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonStyle(editor.isActive('bold'))}
      >
        <Bold size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonStyle(editor.isActive('bulletList'))}
      >
        <List size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonStyle(editor.isActive('orderedList'))}
      >
        <ListOrdered size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonStyle(editor.isActive('blockquote'))}
      >
        <Quote size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonStyle(editor.isActive('heading', { level: 1 }))}
      >
        <Heading1 size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonStyle(editor.isActive('heading', { level: 2 }))}
      >
        <Heading2 size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonStyle(editor.isActive('heading', { level: 3 }))}
      >
        <Heading3 size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={buttonStyle(false)}
      >
        <Undo size={14} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={buttonStyle(false)}
      >
        <Redo size={14} />
      </button>
      <div>
        <button
          type="button"
          onClick={handleImageClick}
          className="rounded-md px-1 py-[4.5px] mt-[2px] bg-white text-black hover:bg-gray-200"
          title="Insert Image"
        >
          <ImageIcon size={14} />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>
    </div>
  )
}

export default Toolbar
