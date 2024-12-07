'use client';

import Image from 'next/image';

import AddPageButton from '@/components/ui/AddPageButton';
import Maincontent from '@/components/ui/Maincontent';
import Comment from '@/components/ui/Comment';
import Sidebar from '@/components/ui/Sidebar';
import {getComments, getPages, updateNoteFavorite} from '@/action';
import {useState, useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useAuth} from '@/components/context/AuthContext';

const Root = ({profile}) => {
  const [pages, setPages] = useState([]);
  const [pagesState, setPagesState] = useState(pages || []);
  const [comments, setComments] = useState([]);
  const searchParams = useSearchParams();
  const pageId = parseInt(searchParams.get('id'), 10) || pagesState[0]?.id;
  const router = useRouter();
  const {isLogin, userId, logoutUser} = useAuth();
  // 현재 활성화된 페이지 찾기
  const activePage = pagesState.find((p) => p.id === pageId) || pagesState[0];
  useEffect(() => {
    console.log('useEffect:', isLogin, userId, pageId);
    if (isLogin) {
      const fetchPages = async () => {
        try {
          const response = await getPages(userId);
          console.log('data:', response);
          setPages(response);
          setPagesState(response);
          console.log('pages:', response);
        } catch (error) {
          console.error('Failed to fetch pages:', error);
        }
      };
      fetchPages();
      router.push('/');
      fetchPages();
    }
    else{
      router.push('/Login');
    }
  }, [isLogin, userId, router]);

  useEffect(() => {
    if (activePage) {
      const fetchComments = async () => {
        try {
          const response = await getComments(activePage.id);
          setComments(response);
        } catch (error) {
          console.error('Failed to fetch comments:', error);
        }
      };
      fetchComments();
    }
  }, [activePage]);

  const updateFavorite = (favorite, id) => {
    updateNoteFavorite(favorite, id);
    const fetchPages = async () => {
      try {
        const response = await getPages(userId);
        setPages(response);
        setPagesState(response);
      } catch (error) {
        console.error('Failed to fetch pages:', error);
      }
    };
    fetchPages();
  };
  // 제목 변경 시 호출되는 함수
  const handleTitleChange = (pageId, newTitle) => {
    setPagesState((prevPages) =>
      prevPages.map((p) => (p.id === pageId ? { ...p, title: newTitle } : p))
    );
  };
  const handleContentChange = (pageId, newContent) => {
    setPagesState((prevPages) =>
      prevPages.map((p) => (p.id === pageId ? { ...p, contents: newContent } : p))
    );
  };
  const handleAddPage = (newPage) => {
    setPagesState((prevPages) => [...prevPages, newPage]);
  };


    return (
      <div className="flex flex-row">
        <div className="w-60 min-h-screen justify-center p-3 bg-stone-200">
          <div className="flex justify-between items-center mb-5">
            <span className="flex text justify-between text-m py-1 px-3 font-bold h-8 my-1">
              <Image src={profile} alt="Profile" className="flex w-8 h-8 rounded-lg mr-1" />
              {userId ? `${userId}의 ...` : '비정상적인 접근입니다.'}
            </span>
            <svg role="graphics-symbol" className="flex w-7 h-5">
              <g>
                <path d="M9.944 14.721c.104.094.216.12.336.079l1.703-.688 6.844-6.844-1.406-1.398-6.836 6.836-.711 1.68c-.052.13-.029.242.07.335zm8.102-9.484l1.414 1.406.515-.523a.917.917 0 00.282-.633.76.76 0 00-.258-.61l-.25-.25a.702.702 0 00-.578-.187.975.975 0 00-.617.297l-.508.5zm-9.453.127a3.85 3.85 0 00-3.85 3.85v6.5a3.85 3.85 0 003.85 3.85h6.5a3.85 3.85 0 003.85-3.85V12.95a.85.85 0 10-1.7 0v2.764a2.15 2.15 0 01-2.15 2.15h-6.5a2.15 2.15 0 01-2.15-2.15v-6.5a2.15 2.15 0 012.15-2.15h3.395a.85.85 0 000-1.7H8.593z"></path>
              </g>
            </svg>
            <span className="flex w-15 h-5 justify-end text-sm font-bold text-red-500 hover:text-red-700 cursor-pointer"
              onClick={() => {
                logoutUser();
                router.push('/Login');
                alert('로그아웃 되었습니다.');
              }}
            >  
              로그아웃
            </span>
          </div>
          <div className="flex jstify-start items-center mb-3">
            <svg role="graphics-symbol" className="flex w-5 h-5 mr-1">
              <g>
                <path d="M4 8.75C4 6.12665 6.12665 4 8.75 4C11.3734 4 13.5 6.12665 13.5 8.75C13.5 11.3734 11.3734 13.5 8.75 13.5C6.12665 13.5 4 11.3734 4 8.75ZM8.75 2.5C5.29822 2.5 2.5 5.29822 2.5 8.75C2.5 12.2018 5.29822 15 8.75 15C10.2056 15 11.545 14.5024 12.6073 13.668L16.7197 17.7803C17.0126 18.0732 17.4874 18.0732 17.7803 17.7803C18.0732 17.4874 18.0732 17.0126 17.7803 16.7197L13.668 12.6073C14.5024 11.545 15 10.2056 15 8.75C15 5.29822 12.2018 2.5 8.75 2.5Z"></path>
              </g>
            </svg>
            <span>Search</span>
          </div>
          <div className="flex justify-start items-center mb-10">
            <svg role="graphics-symbol" className="flex w-5 h-5 mr-1">
              <path d="M10.1416 3.77299C10.0563 3.71434 9.94368 3.71434 9.85837 3.77299L3.60837 8.06989C3.54053 8.11653 3.5 8.19357 3.5 8.2759V14.2499C3.5 14.9402 4.05964 15.4999 4.75 15.4999H7.5L7.5 10.7499C7.5 10.0595 8.05964 9.49987 8.75 9.49987H11.25C11.9404 9.49987 12.5 10.0595 12.5 10.7499L12.5 15.4999H15.25C15.9404 15.4999 16.5 14.9402 16.5 14.2499V8.2759C16.5 8.19357 16.4595 8.11653 16.3916 8.06989L10.1416 3.77299ZM9.00857 2.53693C9.60576 2.12636 10.3942 2.12636 10.9914 2.53693L17.2414 6.83383C17.7163 7.1603 18 7.69963 18 8.2759V14.2499C18 15.7687 16.7688 16.9999 15.25 16.9999H12.25C11.5596 16.9999 11 16.4402 11 15.7499L11 10.9999H9L9 15.7499C9 16.4402 8.44036 16.9999 7.75 16.9999H4.75C3.23122 16.9999 2 15.7687 2 14.2499V8.2759C2 7.69963 2.2837 7.1603 2.75857 6.83383L9.00857 2.53693Z"></path>
            </svg>
            <span>Home</span>
          </div>
          <p className="text-gray-600 mb-2">Private</p>
          <div>
            <Sidebar pages={pagesState} activePage={activePage} updateFavorite={updateFavorite}/>
            <AddPageButton onAddPage={handleAddPage} />
          </div>
        </div>
        <Maincontent
          activePage={activePage} onTitleChange={handleTitleChange} onContentChange={handleContentChange}
        ></Maincontent>
        <Comment>Comments={comments}</Comment>
      </div>
  );
}

export default Root;