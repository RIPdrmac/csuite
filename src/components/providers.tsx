'use client';

import { AuthGuard } from './auth-guard';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
