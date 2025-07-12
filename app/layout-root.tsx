'use client';

import type { Session } from '@/lib/auth/types';
import { SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';

interface LayoutRootProps {
  session: Session;
  children: React.ReactNode;
}

export default function LayoutRoot({ children, session }: LayoutRootProps) {
  return (
    <>
      <AppSidebar variant="inset" user={session.user} />
      <SidebarInset className="md:peer-data-[variant=inset]:shadow-none transition-[width,height] md:peer-data-[variant=inset]:rounded-b-none md:peer-data-[variant=inset]:mb-0">
        {children}
      </SidebarInset>
    </>
  );
}
