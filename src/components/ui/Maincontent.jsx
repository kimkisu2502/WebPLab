'use client';

import { createOrUpdatePage } from "@/action";
import { useState, useEffect } from "react";

const Maincontent = ({ activePage, onTitleChange, onContentChange }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const pageId = activePage?.id || 0;

  // activePage 변경 시 상태 초기화
  useEffect(() => {
    if (activePage) {
      setTitle(activePage.title || ""); // 제목 초기화
      setContent(activePage.contents || ""); // 내용 초기화
    }
  }, [activePage]);

  const handleSave = async (newTitle, newContent) => {
    if (!pageId) {
      return;
    }

    const formData = new FormData();
    formData.append("id", pageId);
    formData.append("title", newTitle);
    formData.append("contents", newContent);

    try {
      await createOrUpdatePage(formData);
    } catch (error) {
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "title") {
      const newTitle = value;
      setTitle(newTitle);
      handleSave(newTitle, content); // title 변경 시 저장
      if (onTitleChange && pageId) {
        onTitleChange(pageId, newTitle);
      }
    } else if (field === "contents") {
      const newContent = value;
      setContent(newContent);
      handleSave(title, newContent); // content 변경 시 저장
      if(onContentChange && pageId) {
        onContentChange(pageId, newContent);
      }
    }
  };

  return (
    <div
      className="w-7/12 max-w-screen-lg py-32"
    >
      <input
        id="title"
        type="text"
        className="w-full text-2xl font-bold border border-gray-300 focus:outline-none mb-3"
        value={title}
        onChange={(e) => handleInputChange("title", e.target.value)} // 상태 업데이트 및 저장
      />
      <textarea
        id="content"
        className="w-full h-64 border p-2 focus:outline-none"
        value={content}
        onChange={(e) => handleInputChange("contents", e.target.value)} // 상태 업데이트 및 저장
      />
    </div>
  );
};

export default Maincontent;