'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { deletePage } from '@/action';
import { act, useEffect, useState } from 'react';
import clsx from 'clsx';

const SidebarRow = ({page, activePage, updateFavorite}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isthere, setIsthere] = useState(true);
    const [favorite, setFavorite] = useState(false);
    const [hoverOnNote, setHoverOnNote] = useState(false);

    const pageId = parseInt(searchParams.get('id'), 10);
    const active = pageId === page.id || activePage.id === page.id;
    page = page || {id:0, title:''};

    useEffect(() => {
        if(page.id === 0){
            setIsthere(false);
        }
        setFavorite(page.favorite);
    }
    , [page]);
    return (
      isthere?
    <div className={clsx(
          'flex justify-start items-center p-1 cursor-pointer rounded-md group',
          active ? 'bg-zinc-400 dark:bg-stone-800' : 'hover:bg-zinc-300 dark:hover:bg-stone-500'
        )}
      onMouseOver={() => setHoverOnNote(true)}
      onMouseLeave={() => setHoverOnNote(false)}
      onClick={(e) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('id', page.id);
        const newPath = `/?${newSearchParams.toString()}`;
        router.push(newPath);
      }}
      >
      <svg
          className={clsx(
            'w-5 h-5 mr-1 mt-0.5 cursor-pointer',
            {
              'text-yellow-500': favorite, // favorite일 때만 노란색 적용
              'text-stone-200 dark:text-stone-700': !favorite && !active && !hoverOnNote,
              'text-zinc-300 dark:text-stone-500': !favorite && !active && hoverOnNote,
              'text-zinc-400 dark:text-stone-800': !favorite && active,
            },
            'hover:text-yellow-500' // 항상 hover 시 노란색 적용
          )}
          viewBox="0 0 24 24"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setFavorite(!favorite);
            updateFavorite(!favorite, page.id);
          }}
        >
          {favorite ? (
            // 즐겨찾기일 경우 꽉찬 별
            <path d="M11.999 2.247l2.01 4.067 
            4.499.654-3.255 3.174.768 4.478-4.022-2.114-4.022 
            2.114.768-4.478-3.255-3.174 4.499-.654L11.999 2.247z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
            />
          ) : (
            // 즐겨찾기 아닐 경우 아웃라인 별
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              d="M11.999 2.247l2.01 4.067 
              4.499.654-3.255 3.174.768 4.478-4.022-2.114-4.022 
              2.114.768-4.478-3.255-3.174 4.499-.654L11.999 2.247z"
            />
          )}
        </svg>
      <svg role="graphics-symbol" 
       className="flex w-5 h-5 mr-1 mt-1 dark:fill-current dark:text-white" ><path d="M4.35645 15.4678H11.6367C13.0996 15.4678 13.8584 14.6953 13.8584 13.2256V7.02539C13.8584 6.0752 13.7354 5.6377 13.1406 5.03613L9.55176 1.38574C8.97754 0.804688 8.50586 0.667969 7.65137 0.667969H4.35645C2.89355 0.667969 2.13477 1.44043 2.13477 2.91016V13.2256C2.13477 14.7021 2.89355 15.4678 4.35645 15.4678ZM4.46582 14.1279C3.80273 14.1279 3.47461 13.7793 3.47461 13.1436V2.99219C3.47461 2.36328 3.80273 2.00781 4.46582 2.00781H7.37793V5.75391C7.37793 6.73145 7.86328 7.20312 8.83398 7.20312H12.5186V13.1436C12.5186 13.7793 12.1836 14.1279 11.5205 14.1279H4.46582ZM8.95703 6.02734C8.67676 6.02734 8.56055 5.9043 8.56055 5.62402V2.19238L12.334 6.02734H8.95703ZM10.4336 9.00098H5.42969C5.16992 9.00098 4.98535 9.19238 4.98535 9.43164C4.98535 9.67773 5.16992 9.86914 5.42969 9.86914H10.4336C10.6797 9.86914 10.8643 9.67773 10.8643 9.43164C10.8643 9.19238 10.6797 9.00098 10.4336 9.00098ZM10.4336 11.2979H5.42969C5.16992 11.2979 4.98535 11.4893 4.98535 11.7354C4.98535 11.9746 5.16992 12.1592 5.42969 12.1592H10.4336C10.6797 12.1592 10.8643 11.9746 10.8643 11.7354C10.8643 11.4893 10.6797 11.2979 10.4336 11.2979Z">
        </path>
      </svg>

      <button
        type="button"
        className="flex items-center">
        {clsx(
          page.title.length > 12 ? page.title.slice(0, 11) + '...' : page.title
        )}
      </button>
      <svg
        role="graphics-symbol"
        className={clsx("w-5 h-5 mt-0.5 mr-1  text-stone-400 hover:text-red-500 cursor-pointer transition-colors duration-200 ml-auto"
          , active && 'text-stone-500'
        )}
        viewBox="0 0 24 24"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          deletePage(page.id);
          setIsthere(false);
        }}
      >
        <path
          d="M6 6 L18 18 M18 6 L6 18"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>:null
    );
};

export default SidebarRow;