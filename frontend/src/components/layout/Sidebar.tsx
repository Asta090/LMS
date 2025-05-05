import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Star,
  Settings,
  LogOut,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

interface SidebarProps {
  role: "admin" | "teacher" | "student";
}

const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-[#121212] border-r border-[#333333] h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="py-6 px-6 border-b border-[#333333]">
        <Link 
          to={
            role === "admin" 
              ? "/admin/dashboard" 
              : role === "teacher" 
                ? "/teacher/dashboard" 
                : "/student/dashboard"
          } 
          className="flex items-center gap-2"
        >
          <div className="h-10 w-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-xl text-[#EEEEEE]">LearnSphere</span>
        </Link>
        <div className="mt-2 text-[#AAAAAA] text-sm">
          {role === "admin" && "Administrator"}
          {role === "teacher" && "Teacher Dashboard"}
          {role === "student" && "Student Dashboard"}
        </div>
      </div>

      <nav className="mt-5 px-4">
        <div className="space-y-1">
          {/* Admin Links */}
          {role === "admin" && (
            <>
              <SidebarLink
                to="/admin/dashboard"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                isActive={isActive("/admin/dashboard")}
              />
              <SidebarLink
                to="/admin/teachers"
                icon={<Users size={18} />}
                label="Teacher Approval"
                isActive={isActive("/admin/teachers")}
              />
              <SidebarLink
                to="/admin/courses"
                icon={<BookOpen size={18} />}
                label="Course Approval"
                isActive={isActive("/admin/courses")}
              />
              <SidebarLink
                to="/admin/reviews"
                icon={<Star size={18} />}
                label="Review Approval"
                isActive={isActive("/admin/reviews")}
              />
              <SidebarLink
                to="/admin/profile"
                icon={<Settings size={18} />}
                label="Profile"
                isActive={isActive("/admin/profile")}
              />
            </>
          )}

          {/* Teacher Links */}
          {role === "teacher" && (
            <>
              <SidebarLink
                to="/teacher/dashboard"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                isActive={isActive("/teacher/dashboard")}
              />
              <SidebarLink
                to="/teacher/my-courses"
                icon={<BookOpen size={18} />}
                label="My Courses"
                isActive={isActive("/teacher/my-courses")}
              />
              <SidebarLink
                to="/teacher/create-course"
                icon={<ClipboardList size={18} />}
                label="Create Course"
                isActive={isActive("/teacher/create-course")}
              />
              <SidebarLink
                to="/teacher/profile"
                icon={<Settings size={18} />}
                label="Profile"
                isActive={isActive("/teacher/profile")}
              />
            </>
          )}

          {/* Student Links */}
          {role === "student" && (
            <>
              <SidebarLink
                to="/student/dashboard"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                isActive={isActive("/student/dashboard")}
              />
              <SidebarLink
                to="/student/browse-courses"
                icon={<BookOpen size={18} />}
                label="Browse Courses"
                isActive={isActive("/student/browse-courses")}
              />
              <SidebarLink
                to="/student/my-courses"
                icon={<ClipboardList size={18} />}
                label="My Courses"
                isActive={isActive("/student/my-courses")}
              />
              <SidebarLink
                to="/student/reviews"
                icon={<Star size={18} />}
                label="My Reviews"
                isActive={isActive("/student/reviews")}
              />
              <SidebarLink
                to="/student/profile"
                icon={<Settings size={18} />}
                label="Profile"
                isActive={isActive("/student/profile")}
              />
            </>
          )}
        </div>
      </nav>

      <div className="absolute bottom-0 w-full border-t border-[#333333] p-4">
        <button 
          className="flex items-center text-red-500 hover:text-red-400 hover:bg-[#1A1A1A] w-full px-3 py-2 rounded-md transition-colors"
          onClick={logout}
        >
          <LogOut size={18} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink = ({ to, icon, label, isActive }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center text-sm px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-primary text-white"
          : "text-[#AAAAAA] hover:text-[#EEEEEE] hover:bg-[#1A1A1A]"
      )}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default Sidebar;
