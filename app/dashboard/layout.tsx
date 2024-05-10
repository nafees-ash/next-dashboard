'use client';
import SideNav from '@/components/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="my-4 ml-1 mr-3 h-[100vh] flex-grow overflow-hidden rounded-lg bg-gray-50 p-5 md:overflow-y-auto md:p-7">
        {children}
      </div>
    </div>
  );
}
