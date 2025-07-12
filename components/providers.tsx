'use client';

import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from '@/components/ui/sidebar';
import { JwtProvider } from '@/contexts/jwt-context';
import { SWRConfig } from 'swr';
import type { Session } from '@/lib/auth/types';

export default function Providers({
  children,
  jwt,
  isCollapsed,
  initialSession,
}: Readonly<{
  children: React.ReactNode;
  jwt: string;
  isCollapsed: boolean;
  initialSession: Session;
}>) {
  return (
    <SWRConfig
      value={{
        fallback: {
          session: initialSession, // Ensures that session is available in the beginning
        },
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <JwtProvider jwt={jwt}>
          <SidebarProvider defaultOpen={!isCollapsed}>
            {children}
          </SidebarProvider>
        </JwtProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}
