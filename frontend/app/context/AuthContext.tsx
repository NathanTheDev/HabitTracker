
'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    api.post('/auth/refresh')
      .then(res => setAccessToken(res.data.accessToken))
      .catch(() => setAccessToken(null));
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.request.use(config => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    })

    return () => api.interceptors.request.eject(interceptor);
  }, [accessToken]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      res => res,
      async error => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            const res = await api.post('/api/auth/refresh')
            setAccessToken(res.data.accessToken)
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
            return api(originalRequest)
          } catch {
            setAccessToken(null)
          }
        }
        return Promise.reject(error)
      }
    )

    return () => api.interceptors.response.eject(interceptor)
  }, [])

  async function login(username: string, password: string) {
    const res = await api.post('/api/auth/login', { username, password })
    setAccessToken(res.data.accessToken)
  }

  async function logout() {
    setAccessToken(null)
    await api.post('/api/auth/logout')
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);

