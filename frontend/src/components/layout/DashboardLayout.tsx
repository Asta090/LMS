import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Star,
  ClipboardList,
  Settings,
  LogOut,
  ChevronDown,
  User,
  Layers,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role || localStorage.getItem("userRole") || "";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Generate dashboard link based on user role
  const getDashboardPath = () => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "teacher") return "/teacher/dashboard";
    return "/student/dashboard";
  };

  // Generate profile link based on user role
  const getProfilePath = () => {
    if (role === "admin") return "/admin/profile";
    if (role === "teacher") return "/teacher/profile";
    return "/student/profile";
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#EEEEEE] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121212] border-r border-[#333333] h-screen fixed left-0 overflow-y-auto">
        <div className="p-6 border-b border-[#333333]">
          <Link
            to={getDashboardPath()}
            className="flex items-center gap-2"
          >
            <div className="h-10 w-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl text-[#EEEEEE]">LearnSphere</span>
          </Link>
          <div className="mt-2 text-[#AAAAAA] text-sm">
            {role === "admin" && "Administration"}
            {role === "teacher" && "Teacher Dashboard"}
            {role === "student" && "Student Dashboard"}
          </div>
        </div>

        <nav className="mt-6 px-6">
          <ul className="space-y-1">
            {/* Admin Links */}
            {role === "admin" && (
              <>
                <NavItem
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                  href="/admin/dashboard"
                  active={isActive("/admin/dashboard")}
                />
                <NavItem
                  icon={<Users size={18} />}
                  label="Teachers"
                  href="/admin/teachers"
                  active={isActive("/admin/teachers")}
                />
                <NavItem
                  icon={<Users size={18} />}
                  label="Students"
                  href="/admin/students"
                  active={isActive("/admin/students")}
                />
                <NavItem
                  icon={<BookOpen size={18} />}
                  label="Courses"
                  href="/admin/courses"
                  active={isActive("/admin/courses")}
                />
                <NavItem
                  icon={<Star size={18} />}
                  label="Reviews"
                  href="/admin/reviews"
                  active={isActive("/admin/reviews")}
                />
              </>
            )}

            {/* Teacher Links */}
            {role === "teacher" && (
              <>
                <NavItem
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                  href="/teacher/dashboard"
                  active={isActive("/teacher/dashboard")}
                />
                <NavItem
                  icon={<BookOpen size={18} />}
                  label="My Courses"
                  href="/teacher/my-courses"
                  active={isActive("/teacher/my-courses")}
                />
                <NavItem
                  icon={<ClipboardList size={18} />}
                  label="Create Course"
                  href="/teacher/create-course"
                  active={isActive("/teacher/create-course")}
                />
              </>
            )}

            {/* Student Links */}
            {role === "student" && (
              <>
                <NavItem
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                  href="/student/dashboard"
                  active={isActive("/student/dashboard")}
                />
                <NavItem
                  icon={<BookOpen size={18} />}
                  label="Browse Courses"
                  href="/student/browse-courses"
                  active={isActive("/student/browse-courses")}
                />
                <NavItem
                  icon={<ClipboardList size={18} />}
                  label="My Courses"
                  href="/student/my-courses"
                  active={isActive("/student/my-courses")}
                />
                <NavItem
                  icon={<Star size={18} />}
                  label="My Reviews"
                  href="/student/reviews"
                  active={isActive("/student/reviews")}
                />
              </>
            )}

            {/* Common Links */}
            <NavItem
              icon={<Settings size={18} />}
              label="Profile"
              href={getProfilePath()}
              active={isActive(getProfilePath())}
            />
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 h-16 bg-[#121212]/80 backdrop-blur-md border-b border-[#333333] flex items-center px-6">
          <div className="flex-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
              <Avatar className="h-8 w-8 bg-[#2A2A2A] border border-[#333333]">
                <AvatarFallback className="bg-[#2A2A2A] text-[#EEEEEE]">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2 text-sm font-medium hidden md:block text-[#EEEEEE]">
                {user?.name || "User"}
              </span>
              <ChevronDown className="ml-1 h-4 w-4 text-[#AAAAAA]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-[#333333] text-[#EEEEEE]">
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-[#EEEEEE]">{user?.name || "User"}</p>
                  <p className="text-xs text-[#AAAAAA]">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-[#333333]" />
              <DropdownMenuItem 
                onClick={() => navigate(getProfilePath())}
                className="hover:bg-[#2A2A2A] focus:bg-[#2A2A2A] cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#333333]" />
              <DropdownMenuItem 
                onClick={logout} 
                className="text-red-500 hover:text-red-400 hover:bg-[#2A2A2A] focus:bg-[#2A2A2A] cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
}

const NavItem = ({ icon, label, href, active }: NavItemProps) => {
  return (
    <li>
      <Link
        to={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm",
          active
            ? "bg-primary text-white"
            : "text-[#AAAAAA] hover:text-[#EEEEEE] hover:bg-[#1A1A1A]"
        )}
      >
        {icon}
        {label}
      </Link>
    </li>
  );
};

export default DashboardLayout; 