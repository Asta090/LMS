import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  hasSidebar?: boolean;
  role?: "admin" | "teacher" | "student";
}

const Layout = ({ children, hasSidebar = false, role }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#121212] text-[#EEEEEE] flex flex-col">
      {!hasSidebar && <Navbar />}
      
      <div className="flex flex-1">
        {hasSidebar && role && <Sidebar role={role} />}
        
        <main className={cn(
          "flex-1 px-4 sm:px-6 lg:px-8 py-8",
          hasSidebar && "ml-64",
          !hasSidebar && "pt-24"
        )}>
          <div className="max-w-7xl mx-auto">
          {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
