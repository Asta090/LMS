import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Star, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminAPI } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch stats and pending approval data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      const response = await adminAPI.getDashboardStats();
      return response.data;
    },
  });

  // If loading, show a loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#AAAAAA]" />
        </div>
      </DashboardLayout>
    );
  }

  // If there's an error, show an error message
  if (isError) {
    return (
      <DashboardLayout>
        <div className="py-8">
          <Alert variant="destructive" className="bg-red-900/40 text-red-400 border-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load dashboard data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  // Map backend response to the expected format
  const stats = {
    totalUsers: data?.totalStudents + data?.totalTeachers || 0,
    totalTeachers: data?.totalTeachers || 0,
    totalStudents: data?.totalStudents || 0,
    totalCourses: data?.totalCourses || 0
  };
  
  // Fetch pending data from the response
  const pendingTeachers = data?.pendingTeachers ? Array.isArray(data.pendingTeachers) ? 
    data.pendingTeachers : new Array(data.pendingTeachers) : [];
  const pendingCourses = data?.pendingCourses ? Array.isArray(data.pendingCourses) ? 
    data.pendingCourses : new Array(data.pendingCourses) : [];
  const pendingReviews = data?.pendingReviews ? Array.isArray(data.pendingReviews) ? 
    data.pendingReviews : new Array(data.pendingReviews) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[#EEEEEE]">Admin Dashboard</h1>
            <p className="text-[#AAAAAA]">
              Welcome back, {user?.name || "Admin"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users */}
          <Card className="bg-[#1A1A1A] border border-[#333333] hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[#EEEEEE]">
                <Users className="mr-2 text-primary" size={20} />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-[#EEEEEE]">
                    {stats.totalUsers}
                  </p>
                  <p className="text-sm text-[#AAAAAA]">Registered Users</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#AAAAAA]">
                    {stats.totalTeachers} teachers, {stats.totalStudents} students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Courses */}
          <Card className="bg-[#1A1A1A] border border-[#333333] hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[#EEEEEE]">
                <BookOpen className="mr-2 text-primary" size={20} />
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-[#EEEEEE]">
                    {stats.totalCourses}
                  </p>
                  <p className="text-sm text-[#AAAAAA]">Available Courses</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/courses")}
                  className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                >
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="bg-[#1A1A1A] border border-[#333333] hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[#EEEEEE]">
                <Star className="mr-2 text-primary" size={20} />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#EEEEEE]">
                    {typeof pendingTeachers === 'number' ? pendingTeachers : pendingTeachers.length}
                  </p>
                  <p className="text-sm text-[#AAAAAA]">Teachers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#EEEEEE]">
                    {typeof pendingCourses === 'number' ? pendingCourses : pendingCourses.length}
                  </p>
                  <p className="text-sm text-[#AAAAAA]">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#EEEEEE]">
                    {typeof pendingReviews === 'number' ? pendingReviews : pendingReviews.length}
                  </p>
                  <p className="text-sm text-[#AAAAAA]">Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Teacher Approvals */}
          <Card className="bg-[#1A1A1A] border border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#EEEEEE]">
                Pending Teacher Approvals
              </CardTitle>
              <CardDescription className="text-[#AAAAAA]">
                Teachers awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(pendingTeachers) && pendingTeachers.length > 0 ? (
                <div className="space-y-3">
                  {pendingTeachers.slice(0, 3).map((teacher) => (
                    <div 
                      key={teacher._id} 
                      className="border border-[#333333] rounded-lg p-4 bg-[#121212]/50 hover:border-primary transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-[#EEEEEE]">{teacher.name}</h3>
                          <p className="text-sm text-[#AAAAAA]">{teacher.email}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/teachers`)}
                          className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                
                  {pendingTeachers.length > 3 && (
                    <div className="text-center mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/admin/teachers")}
                        className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                      >
                        View All ({pendingTeachers.length})
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center py-6 text-[#AAAAAA]">No pending teacher approvals</p>
              )}
            </CardContent>
          </Card>

          {/* Pending Course Approvals */}
          <Card className="bg-[#1A1A1A] border border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#EEEEEE]">
                Pending Course Approvals
              </CardTitle>
              <CardDescription className="text-[#AAAAAA]">
                Courses awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(pendingCourses) && pendingCourses.length > 0 ? (
                <div className="space-y-3">
                  {pendingCourses.slice(0, 3).map((course) => (
                    <div 
                      key={course._id} 
                      className="border border-[#333333] rounded-lg p-4 bg-[#121212]/50 hover:border-primary transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-[#EEEEEE]">{course.title}</h3>
                          <p className="text-sm text-[#AAAAAA]">
                            by {course.teacher ? course.teacher.name : "Unknown"}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/courses`)}
                          className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                
                  {pendingCourses.length > 3 && (
                    <div className="text-center mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => navigate("/admin/courses")}
                        className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                      >
                        View All ({pendingCourses.length})
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center py-6 text-[#AAAAAA]">No pending course approvals</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
