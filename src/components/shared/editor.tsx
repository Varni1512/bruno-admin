import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image';

import Toolbar from './toolbar';

interface EditorProps { 
  initialValue?: string;
  onChange?: (html: string) => void; 
  max?: number;
}

const Editor: React.FC<EditorProps> = ({ initialValue = '', onChange,max }) => { 
  const editor = useEditor({
    extensions: [
      StarterKit, 
      Image,
      ImageResize
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (editor && initialValue !== editor.getHTML()) {
       editor.commands.setContent(initialValue, false);
    }
  }, [initialValue, editor]);
const editorRef = useRef<any>(null);



  return (
    <>
      {editor && <Toolbar editor={editor} />}
      <div onClick={() => {
        if (editor && !editor.isFocused) {
          editor.commands.focus()
        }
      }} className="prose -mt-3.5 dark:prose-invert max-w-full flex-1  w-full  justify-end items-end  rounded-md border border-pre">
        <EditorContent onClick={() => console.log("clicked")} ref={editorRef} editor={editor} style={{maxHeight:max}} className={`px-2 h-fit flex-1 overflow-y-scroll mt-2 border-none outline-none ring-none`} />
      </div>
    </>
  );
};

export default Editor; // Export the renamed component