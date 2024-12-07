'use client';

import { useState, useEffect } from 'react';
import { createOrUpdatePage } from '@/action';
import { MDXProvider } from '@mdx-js/react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import {visit} from 'unist-util-visit';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug'; 
import clsx from 'clsx';

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
};

const Maincontent = ({ activePage, onTitleChange, onContentChange }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [serializedContent, setSerializedContent] = useState(null);
  const [toc, setToc] = useState([]);
  const [tocVisible, setTocVisible] = useState(false);
  const pageId = activePage?.id || 0;

  useEffect(() => {
    const initializeContent = async () => {
      if (activePage) {
        setTitle(activePage.title || "");
        setContent(activePage.contents || "");
        const dmxSource = await serialize(activePage.contents || "", {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
           rehypePlugins: [rehypeSlug],
          },
        });
        setSerializedContent(dmxSource);
      }
    };
    initializeContent();
    serializeContent(content);
  }, [activePage]);

  const serializeContent = async (content) => {
    const tocData = []; // ToC를 저장할 배열
  
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          () => (tree) => { // 커스텀 rehype 플러그인
            visit(tree, 'element', (node) => {
              if (['h1', 'h2', 'h3'].includes(node.tagName)) {
                const textContent = node.children
                  .filter((child) => child.type === 'text' || child.type === 'element')
                  .map((child) => {
                    if (child.type === 'text') return child.value;
                    if (child.type === 'element') {
                      return child.children
                        .filter((grandchild) => grandchild.type === 'text')
                        .map((grandchild) => grandchild.value)
                        .join('');
                    }
                    return '';
                  })
                  .join('');
  
                tocData.push({
                  id: node.properties.id,
                  text: textContent,
                  level: node.tagName,
                });
              }
            });
          },
        ],
      },
    });
  
    setSerializedContent(mdxSource);
    console.log('ToC:', tocData);
    setToc(tocData); // ToC 상태 업데이트
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

  const handleInputChange = (field, value) => {
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
      if (onContentChange && pageId) {
        onContentChange(pageId, newContent);
      }
    }
  };

  const ContentArea = () => (
    <div className="w-full py-32 px-10">
      <div className="flex justify-end mb-3">
        <button
          className="w-14 bg-slate-600 text-white py-2 rounded-md hover:bg-slate-800 transition duration-200"
          onClick={() => setViewMode(!viewMode)}
        >
          {viewMode ? 'edit' : 'view'}
        </button>
        <button
          className="w-14 ml-3 bg-slate-600 text-white py-2 rounded-md hover:bg-slate-800 transition duration-200"
          onClick={() => setTocVisible((v) => !v)}
        >
          toc
        </button>
      </div>
      {viewMode ? (
        <>
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
              {serializedContent ? <MDXRemote {...serializedContent} /> : null}
            </MDXProvider>
          </div>
        </>
      ) : (
        <>
          <input
            id="title"
            type="text"
            className="w-full text-2xl font-bold border border-gray-300 focus:outline-none mb-3 p-2"
            value={title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
          <textarea
            id="content"
            className="w-full min-h-screen border p-2 focus:outline-none"
            value={content}
            onChange={(e) => handleInputChange("contents", e.target.value)}
          />
        </>
      )}
    </div>
  );

  const TocArea = () => (
    <div className="w-60 h-full p-3 bg-stone-200">
      <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
      <ul className="list-disc list-inside">
        {toc.map((item) => (
          <li
            key={item.id}
            className={item.level === 'h1' ? '' : item.level === 'h2' ? 'ml-4' : 'ml-8'}
          >
            <a href={`#${item.id}`} className="text-blue-500 hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
  <div className="flex flex-grow">
    <div className="flex justify-center flex-grow m-10">
      {/* 최대 폭을 제한한 컨테이너 */}
      <div className={clsx(
        "flex items-center" ,
        tocVisible ? ' w7/12' : ' w-7/12'
      )}
      >
        {/* 중앙 컨텐츠 영역 */}
        <ContentArea />
      </div>

      
    </div>
      {/* 오른쪽 TOC 영역 (없을 때 비워서 레이아웃 유지) */}
      {tocVisible ? <TocArea /> : null}
    </div>
  );
};

export default Maincontent;