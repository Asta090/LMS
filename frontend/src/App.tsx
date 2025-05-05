import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Auth Pages
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

// Dashboard Pages
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";

// Admin Pages
import TeacherApprovalPage from "./pages/Admin/TeacherApprovalPage";
import CourseApprovalPage from "./pages/Admin/CourseApprovalPage";
import ReviewApprovalPage from "./pages/Admin/ReviewApprovalPage";
import StudentsPage from "./pages/Admin/StudentsPage";
import StudentDetailsPage from "./pages/Admin/StudentDetailsPage";

// Teacher Pages
import CreateCoursePage from "./pages/Teacher/CreateCoursePage";
import TeacherMyCoursesPage from "./pages/Teacher/MyCoursesPage";
import EditCoursePage from "./pages/Teacher/EditCoursePage";
import CourseDetailsPage from "./pages/Teacher/CourseDetailsPage";

// Student Pages
import BrowseCoursesPage from "./pages/Courses/BrowseCoursesPage";
import CourseDetailPage from "./pages/Courses/CourseDetailPage"; 
import StudentMyCoursesPage from "./pages/Student/MyCoursesPage";
import MyReviewsPage from "./pages/Student/MyReviewsPage";

// Profile Page (shared by all roles)
import ProfilePage from "./pages/Profile/ProfilePage";

const queryClient = new QueryClient();

// Protected routes for different roles
const ProtectedRoute = ({ 
  allowedRoles = [], 
  redirectPath = "/login"
}: { 
  allowedRoles?: string[], 
  redirectPath?: string
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

// Router setup with AuthProvider
const AppRouter = () => (
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
    {/* Admin Routes */}
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/teachers" element={<TeacherApprovalPage />} />
            <Route path="/admin/courses" element={<CourseApprovalPage />} />
            <Route path="/admin/reviews" element={<ReviewApprovalPage />} />
      <Route path="/admin/students" element={<StudentsPage />} />
      <Route path="/admin/students/:id" element={<StudentDetailsPage />} />
      <Route path="/admin/profile" element={<ProfilePage />} />
    </Route>
            
            {/* Teacher Routes */}
    <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/create-course" element={<CreateCoursePage />} />
      <Route path="/teacher/my-courses" element={<TeacherMyCoursesPage />} />
      <Route path="/teacher/courses/:id/edit" element={<EditCoursePage />} />
      <Route path="/teacher/courses/:id" element={<CourseDetailsPage />} />
      <Route path="/teacher/profile" element={<ProfilePage />} />
    </Route>
            
            {/* Student Routes */}
    <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
      <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/browse-courses" element={<BrowseCoursesPage />} />
            <Route path="/student/my-courses" element={<StudentMyCoursesPage />} />
            <Route path="/student/reviews" element={<MyReviewsPage />} />
      <Route path="/student/profile" element={<ProfilePage />} />
    </Route>
    
    {/* Course Detail - Accessible to both students and teachers */}
    <Route element={<ProtectedRoute allowedRoles={["student", "teacher"]} />}>
            <Route path="/courses/:id" element={<CourseDetailPage />} />
    </Route>
            
    <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRouter />
        </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
