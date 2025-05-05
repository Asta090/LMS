import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardList, Star, Loader2 } from "lucide-react";
import { studentAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch enrolled courses
  const { data: enrolledCoursesData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["studentEnrollments"],
    queryFn: async () => {
      const response = await studentAPI.getEnrolledCourses();
      return response.data;
    },
  });

  // Fetch student's reviews
  const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["studentReviews"],
    queryFn: async () => {
      const response = await studentAPI.getMyReviews();
      return response.data;
    },
  });

  // Calculate stats from actual data
  const stats = {
    enrolledCourses: enrolledCoursesData?.length || 0,
    completedCourses: enrolledCoursesData?.filter((enrollment: any) => enrollment.progress === 100).length || 0,
    submittedReviews: reviewsData?.length || 0,
  };

  // For courses that don't have progress tracking yet, assign a default value
  const processedCourses = enrolledCoursesData?.map((enrollment: any) => ({
    id: enrollment.course?._id,
    title: enrollment.course?.title || "Untitled Course",
    teacher: enrollment.course?.teacher?.name || "Unknown Instructor",
    // Default progress value if not provided by API
    progress: enrollment.progress || 0,
    completed: enrollment.progress === 100,
    enrolledAt: enrollment.joinedAt || enrollment.createdAt,
  })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[#EEEEEE]">Student Dashboard</h1>
            <p className="text-[#AAAAAA]">
              Welcome back, {user?.name || "Student"}
            </p>
          </div>
          <Button onClick={() => navigate("/student/browse-courses")} className="bg-primary hover:bg-primary/90">
            Browse Courses
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Enrolled Courses */}
          <Card className="bg-[#1A1A1A] border border-[#333333] hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[#EEEEEE]">
                <BookOpen className="mr-2 text-primary" size={20} />
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCourses ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-[#AAAAAA]" />
                </div>
              ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-[#EEEEEE]">{stats.enrolledCourses}</p>
                  <p className="text-sm text-[#AAAAAA]">Total Courses</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/student/my-courses")}
                  className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                >
                  View All
                </Button>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Courses */}
          <Card className="bg-[#1A1A1A] border border-[#333333] hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[#EEEEEE]">
                <ClipboardList className="mr-2 text-primary" size={20} />
                Completed Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCourses ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-[#AAAAAA]" />
                </div>
              ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-[#EEEEEE]">{stats.completedCourses}</p>
                  <p className="text-sm text-[#AAAAAA]">Courses Completed</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#AAAAAA]">
                      {stats.enrolledCourses ? Math.round((stats.completedCourses / stats.enrolledCourses) * 100) : 0}% completion rate
                  </p>
                </div>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="bg-[#1A1A1A] border border-[#333333] hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[#EEEEEE]">
                <Star className="mr-2 text-primary" size={20} />
                Course Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingReviews ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-[#AAAAAA]" />
                </div>
              ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-[#EEEEEE]">{stats.submittedReviews}</p>
                  <p className="text-sm text-[#AAAAAA]">Reviews Submitted</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/student/reviews")}
                  className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                >
                  View All
                </Button>
              </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <Card className="bg-[#1A1A1A] border border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#EEEEEE]">Your Courses</CardTitle>
            <CardDescription className="text-[#AAAAAA]">Continue learning from where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCourses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#AAAAAA]" />
              </div>
            ) : processedCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
                {processedCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="border border-[#333333] rounded-lg p-4 hover:border-primary transition-colors bg-[#121212]/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[#EEEEEE]">{course.title}</h3>
                      <p className="text-sm text-[#AAAAAA]">
                        Instructor: {course.teacher}
                      </p>
                        {course.enrolledAt && (
                          <p className="text-xs text-[#AAAAAA] mt-1">
                            Enrolled on: {formatDate(course.enrolledAt)}
                          </p>
                        )}
                    </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
                      >
                      {course.completed ? "Review" : "Continue"}
                    </Button>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                      <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#AAAAAA] mt-1 text-right">
                      {course.progress}% complete
                    </p>
                  </div>
                </div>
                ))}
            </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#AAAAAA]">You haven't enrolled in any courses yet.</p>
                <Button 
                  className="mt-4 bg-primary hover:bg-primary/90" 
                  onClick={() => navigate("/student/browse-courses")}
                >
                  Browse Courses
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
