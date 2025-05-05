import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Star, Loader2, AlertCircle, ClipboardCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { teacherAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch stats data from the backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ["teacherDashboardStats"],
    queryFn: async () => {
      const response = await teacherAPI.getDashboardStats();
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

          <div className="mt-8">
            <Button onClick={() => navigate("/teacher/create-course")} className="bg-primary hover:bg-primary/90">
              Create New Course
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, recentCourses } = data || { stats: {}, recentCourses: [] };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[#EEEEEE]">Teacher Dashboard</h1>
            <p className="text-[#AAAAAA]">
              Welcome back, {user?.name || "Teacher"}
            </p>
          </div>
          <Button 
            onClick={() => navigate("/teacher/create-course")}
            className="bg-primary hover:bg-primary/90"
          >
            Create New Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <p className="text-2xl font-bold text-[#EEEEEE]">{stats.totalCourses || 0}</p>
                  <p className="text-sm text-[#AAAAAA]">Courses Created</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/teacher/my-courses")}
                  className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                >
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Total Students */}
          <Card className="bg-[#1A1A1A] border border-[#333333] hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[#EEEEEE]">
                <Users className="mr-2 text-primary" size={20} />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-[#EEEEEE]">{stats.totalStudents || 0}</p>
                  <p className="text-sm text-[#AAAAAA]">Enrolled Students</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#AAAAAA]">
                    Across {stats.totalCourses || 0} courses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="bg-[#1A1A1A] border border-[#333333] hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[#EEEEEE]">
                <ClipboardCheck className="mr-2 text-primary" size={20} />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-[#EEEEEE]">{stats.pendingCourses || 0}</p>
                  <p className="text-sm text-[#AAAAAA]">Pending Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Overview */}
        <Card className="bg-[#1A1A1A] border border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#EEEEEE]">Your Courses</CardTitle>
            <CardDescription className="text-[#AAAAAA]">
              Manage and monitor your created courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentCourses && recentCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {recentCourses.map((course) => (
                  <div 
                    key={course._id} 
                    className="border border-[#333333] rounded-lg p-4 hover:border-primary transition-colors bg-[#121212]/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-[#EEEEEE]">{course.title}</h3>
                        <p className="text-sm text-[#AAAAAA]">
                          Status: <span className={`${
                            course.status === "approved" ? "text-green-400" : 
                            course.status === "rejected" ? "text-red-400" : 
                            "text-yellow-400"
                          }`}>{course.status.charAt(0).toUpperCase() + course.status.slice(1)}</span>
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="text-xs text-[#AAAAAA] mr-4">
                            <span className="inline-flex items-center">
                              <Users size={12} className="mr-1" /> {course.students || 0} students
                            </span>
                          </p>
                          {course.createdAt && (
                            <p className="text-xs text-[#AAAAAA]">
                              <span>Created: {formatDate(course.createdAt)}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/teacher/courses/${course._id}`)}
                          className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/teacher/courses/${course._id}/edit`)}
                          className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#AAAAAA]">You haven't created any courses yet.</p>
                <Button 
                  className="mt-4 bg-primary hover:bg-primary/90" 
                  onClick={() => navigate("/teacher/create-course")}
                >
                  Create Your First Course
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
