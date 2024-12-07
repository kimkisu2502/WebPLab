'use client';

import { useState, useEffect } from 'react';
import { createOrUpdatePage } from '@/action';
import { MDXProvider } from '@mdx-js/react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';



const components = {
  h1: (props) => <h1 className="text-4xl font-bold my-4" {...props} />,
  h2: (props) => <h2 className="text-3xl font-bold my-3" {...props} />,
  h3: (props) => <h3 className="text-2xl font-bold my-2" {...props} />,
  p: (props) => <p className="text-base my-2" {...props} />,
  ul: (props) => <ul className="list-disc list-inside my-2" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside my-2" {...props} />,
  li: (props) => <li className="my-1" {...props} />,
  table: (props) => <table className="table-auto w-full my-4 border-collapse" {...props} />,
  th: (props) => <th className="px-4 py-2 border bg-gray-200" {...props} />,
  td: (props) => <td className="px-4 py-2 border" {...props} />,
  strong: (props) => <strong className="font-bold" {...props} />,
}

const Maincontent = ({ activePage, onTitleChange, onContentChange }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [serializedContent, setSerializedContent] = useState(null);
  const pageId = activePage?.id || 0;

  // activePage 변경 시 상태 초기화
  useEffect(() => {
    const initializeContent = async () => {
      if (activePage) {
        setTitle(activePage.title || ""); // 제목 초기화
        setContent(activePage.contents || ""); // 내용 초기화
        const dmxSource = await serialize(activePage.contents || "", {
          mdxOptions: {
            remarkPlugins: [remarkGfm], // GFM 지원 추가
          }
        }); // 내용 serialize
        setSerializedContent(dmxSource);
      }
    };
    initializeContent();
  }, [activePage]);

  const serializeContent = async (content) => {
    const mdxSource = await serialize(content, {
      mdxOptions: { remarkPlugins: [remarkGfm] }
    });
    setSerializedContent(mdxSource);
  };

  const handleSave = async (newTitle, newContent) => {
    if (!pageId) return;

    const formData = new FormData();
    formData.append("id", pageId);
    formData.append("title", newTitle);
    formData.append("contents", newContent);

    try {
      await createOrUpdatePage(formData);
    } catch (error) {
      console.error("Error saving page:", error);
    }
  };

  const handleInputChange = async (field, value) => {
    if (field === "title") {
      const newTitle = value;
      setTitle(newTitle);
      handleSave(newTitle, content);
      if (onTitleChange && pageId) {
        onTitleChange(pageId, newTitle);
      }
    } else if (field === "contents") {
      const newContent = value;
      setContent(newContent);
      handleSave(title, newContent);
      await serializeContent(newContent);
      if (onContentChange && pageId) {
        onContentChange(pageId, newContent);
      }
    }
  };

  return (
    !viewMode ? (
      // Edit mode
      <div className="w-2/3 max-w-screen-lg py-32">
        <div className="flex justify-end">
          <button
            className="w-14 bg-slate-600 text-white py-2 rounded-md hover:bg-slate-800 transition duration-200 mb-3"
            onClick={() => setViewMode(true)}
          >
            view
          </button>
        </div>
        <input
          id="title"
          type="text"
          className="w-full text-2xl font-bold border border-gray-300 focus:outline-none mb-3 p-2"
          value={title}
          onChange={(e) => handleInputChange("title", e.target.value)} // 상태 업데이트 및 저장
        />
        <textarea
          id="content"
          className="w-full h-full border p-2 focus:outline-none"
          value={content}
          onChange={(e) => handleInputChange("contents", e.target.value)} // 상태 업데이트 및 저장
        />
      </div>
    ) : (
      // View mode
      <div className="w-2/3 max-w-screen-lg py-32">
        <div className="flex justify-end">
          <button
            className="w-14 bg-slate-600 text-white py-2 rounded-md hover:bg-slate-800 transition duration-200 mb-3"
            onClick={() => setViewMode(false)}
          >
            edit
          </button>
        </div>
        <input
          id="title"
          type="text"
          className="w-full text-2xl font-bold focus:outline-none mb-3"
          value={title}
          readOnly
          spellCheck="false"
        />
        <div className="w-full h-auto p-2 whitespace-pre-wrap break-words">
          <MDXProvider components={components}>
            {serializedContent ? <MDXRemote {...serializedContent}  /> : null}
          </MDXProvider>
        </div>
      </div>
    )
  );
};

export default Maincontent;