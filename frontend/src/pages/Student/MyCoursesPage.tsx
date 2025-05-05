import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Search, Loader2, AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { studentAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

// Define TypeScript interfaces for better type safety
interface Course {
  id: string;
  title: string;
  description: string;
  teacherName: string;
  students: number;
  rating: number;
  progress: number;
  joinedAt: string;
}

const MyCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);

  // Fetch enrolled courses from the backend with improved error handling
  const { data: enrolledCoursesData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["studentEnrolledCourses"],
    queryFn: async () => {
      try {
        const response = await studentAPI.getEnrolledCourses();
        console.log("API Response:", response.data);
        return response.data;
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Direct function to update progress without using the mutation
  const handleIncreaseProgress = useCallback(async (courseId: string, currentProgress: number) => {
    try {
      // Prevent double-clicks
      if (updatingCourseId) return;

      setUpdatingCourseId(courseId);
      const newProgress = Math.min(currentProgress + 10, 100);
      
      console.log(`Updating progress for course ${courseId} to ${newProgress}%`);
      
      // Get the token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Not authenticated. Please log in again.");
        return;
      }
      
      // Make a direct API call to update progress
      const response = await axios.patch(
        `http://localhost:4000/api/student/courses/${courseId}/progress`, 
        { progress: newProgress },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      console.log("Progress update response:", response.data);
      
      // Show success message
      toast.success("Progress updated successfully");
      
      // Refetch the courses list to show the updated progress
      await refetch();
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error(`Failed to update progress: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setUpdatingCourseId(null);
    }
  }, [refetch, updatingCourseId]);

  // Transform API data to match component requirements with better null checking
  const enrolledCourses = React.useMemo<Course[]>(() => {
    if (!enrolledCoursesData || !Array.isArray(enrolledCoursesData)) {
      console.log("No course data or invalid format");
      return [];
    }
    
    return enrolledCoursesData.map((enrollment) => {
      // Check if course data exists
      if (!enrollment.course) {
        console.log("Missing course data for enrollment:", enrollment);
        return null;
      }
      
      return {
        id: enrollment.course._id,
        title: enrollment.course.title || "Untitled Course",
        description: enrollment.course.description || "No description available",
        teacherName: enrollment.course.teacher?.name || "Unknown Instructor",
        students: enrollment.course.enrollmentCount || 0,
        rating: enrollment.course.rating || 0,
        progress: enrollment.progress || 0,
        joinedAt: enrollment.joinedAt || new Date().toISOString(),
      };
    }).filter(Boolean) as Course[]; // Remove null entries
  }, [enrolledCoursesData]);

  // Filter courses based on search query
  const filteredCourses = enrolledCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <Layout hasSidebar role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">
            Courses you've enrolled in
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your enrolled courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load your courses: {error instanceof Error ? error.message : "Unknown error"}. 
              <Button 
                variant="link" 
                className="p-0 h-auto text-destructive-foreground underline ml-2"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>By {course.teacherName}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <p className="text-sm line-clamp-3 mb-4">{course.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={course.progress} className="h-2 flex-grow" />
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-6 w-6 rounded-full" 
                        onClick={() => handleIncreaseProgress(course.id, course.progress)}
                        disabled={course.progress >= 100 || updatingCourseId === course.id}
                        title="Increase progress by 10%"
                      >
                        {updatingCourseId === course.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/40 pt-3">
                  <Button 
                    onClick={() => handleViewCourse(course.id)}
                    className="w-full"
                  >
                    {course.progress > 0 ? "Continue Learning" : "Start Course"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search query" : "You haven't enrolled in any courses yet"}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/student/browse-courses")}>
                Browse Courses
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyCoursesPage;
