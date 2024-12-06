'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {login} from '@/action';
import {useAuth} from '@/components/context/AuthContext';

const Login = () => {
  const router = useRouter();
  const {loginUser} = useAuth();
  const [userId, setuserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('password', password);

    if(!userId || !password){
        alert('아이디와 비밀번호를 입력해주세요.');
        return;
    }

    try{
        const result = await login(formData);
        console.log(result);
        if(result.error){
            throw new Error(result.error);
        }
        loginUser(result.userId);
        setuserId(result.userId);
        router.push('/');
    }catch(error){
        console.log(error);
        alert(error.message);
        return;
    }
    
    console.log('로그인 시도:', { userId, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl max-w-md w-full p-6 rounded-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">로그인</h2>
          <p className="text-gray-600">아이디와 비밀번호를 입력하세요.</p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* 이메일 입력 필드 */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="userId">
              아이디
            </label>
            <div className="flex items-center border rounded-md px-3 py-2 bg-white">
              <input
                type="userId"
                id="userId"
                className="flex-grow outline-none"
                placeholder="아이디 입력"
                value={userId}
                onChange={(e) => setuserId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
              비밀번호
            </label>
            <div className="flex items-center border rounded-md px-3 py-2 bg-white">
              <input
                type="password"
                id="password"
                className="flex-grow outline-none"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-5 h-5 text-gray-400"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 mb-3"
            >
              로그인
            </button>
          </div>
        </form>
        <button
              className="w-full bg-gray-300 text-white py-2 rounded-md hover:bg-gray-400 transition duration-200"
            onClick={() => router.push('/Register')}
            >
              회원가입
            </button>
      </div>
    </div>
  );
};

export default Login;