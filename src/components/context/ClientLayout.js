'use client';

import { AuthProvider } from './AuthContext';

const ClientLayout = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ClientLayout;