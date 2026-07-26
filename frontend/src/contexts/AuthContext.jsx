import React, { createContext, useContext, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('adminSession');
    return saved ? JSON.parse(saved) : null;
  });
  const [member, setMember] = useState(() => {
    const saved = localStorage.getItem('memberSession');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const loginAdmin = async (email, password) => {
    console.log('👤 loginAdmin called');
    setLoading(true);
    try {
      const data = await API.adminLogin(email, password);
      console.log('👤 loginAdmin success:', data);
      setAdmin(data);
      localStorage.setItem('adminSession', JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    API.adminLogout();
    setAdmin(null);
    localStorage.removeItem('adminSession');
  };

  const loginMember = async (email, password) => {
    console.log('👤 loginMember called');
    setLoading(true);
    try {
      const data = await API.memberLogin(email, password);
      console.log('👤 loginMember success:', data);
      setMember(data);
      localStorage.setItem('memberSession', JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logoutMember = () => {
    API.memberLogout();
    setMember(null);
    localStorage.removeItem('memberSession');
  };

  return (
    <AuthContext.Provider value={{
      admin,
      member,
      loading,
      loginAdmin,
      logoutAdmin,
      loginMember,
      logoutMember
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}