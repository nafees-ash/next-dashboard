'use client';
import SideNav from '@/components/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="py-4 mr-3 px-2 h-[100vh] flex-grow overflow-hidden rounded-lg  ">
        {children}
      </div>
    </div>
  );
}
