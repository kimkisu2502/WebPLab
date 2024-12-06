// src/components/context/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState(null); // 유저 아이디 상태 추가

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLogin');
    const storedUserId = localStorage.getItem('userId');
    if (storedLogin === 'true' && storedUserId) {
      setIsLogin(true);
      setUserId(storedUserId);
    }
  }, []);

  const loginUser = (id) => { // 로그인 시 유저 아이디를 받아 저장
    localStorage.setItem('isLogin', 'true');
    localStorage.setItem('userId', id);
    setIsLogin(true);
    setUserId(id);
  };

  const logoutUser = () => {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userId');
    setIsLogin(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLogin, userId, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);