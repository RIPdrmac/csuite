'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'csuite-auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setAuthenticated(stored === 'true');
  }, []);

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass }),
    });
    if (res.ok) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-full max-w-sm px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white tracking-tight">CSUITE</h1>
            <p className="text-zinc-500 text-sm mt-2 tracking-widest uppercase">Executive Operating System</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Username"
              className="w-full h-12 px-4 text-[14px] bg-[#13161b] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              className="w-full h-12 px-4 text-[14px] bg-[#13161b] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className="text-red-400 text-[13px] text-center">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full h-12 bg-indigo-500 text-white rounded-xl font-semibold text-[14px] hover:bg-indigo-400 transition-colors"
            >
              Sign In
            </button>
          </div>
          <p className="text-zinc-700 text-xs text-center mt-6">Authorized access only</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
