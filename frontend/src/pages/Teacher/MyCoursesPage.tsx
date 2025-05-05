import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Edit, Users, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { teacherAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch teacher's courses
  const { data: coursesData, isLoading, isError } = useQuery({
    queryKey: ["teacherCourses"],
    queryFn: async () => {
      const response = await teacherAPI.getMyCourses();
      return response.data;
    },
  });

  // Transform API data to match component requirements
  const transformedCourses = React.useMemo(() => {
    if (!coursesData) return [];
    
    return coursesData.map((course: any) => ({
      id: course._id,
      title: course.title,
      description: course.description,
      students: course.enrollments?.length || 0,
      status: course.status.charAt(0).toUpperCase() + course.status.slice(1), // Capitalize status
      createdAt: course.createdAt,
      rejectionReason: course.rejectionReason,
    }));
  }, [coursesData]);

  // Filter courses based on search query
  const filteredCourses = transformedCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handler for editing a course
  const handleEditCourse = (courseId) => {
    navigate(`/teacher/courses/${courseId}/edit`);
  };

  // Handler for viewing a course
  const handleViewCourse = (courseId) => {
    navigate(`/teacher/courses/${courseId}`);
  };

  // Get course status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground">
              Manage your course portfolio
            </p>
          </div>
          <Link to="/teacher/create-course">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load courses. Please try again later.
            </AlertDescription>
          </Alert>
        ) : (
          /* Courses Tabs */
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          {["all", "approved", "pending", "rejected"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              {filteredCourses.filter(course => 
                tab === "all" ? true : course.status.toLowerCase() === tab
              ).length > 0 ? (
                <div className="space-y-4">
                  {filteredCourses
                    .filter(course => tab === "all" ? true : course.status.toLowerCase() === tab)
                    .map((course) => (
                      <Card key={course.id} className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/40 py-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <CardTitle className="text-md">{course.title}</CardTitle>
                            <div className="flex gap-2 items-center">
                              {getStatusBadge(course.status)}
                                <span className="text-xs text-muted-foreground">
                                  Created on {formatDate(course.createdAt)}
                                </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <p className="text-sm">{course.description}</p>
                              
                                {course.status.toLowerCase() === "approved" && (
                                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                  <Users size={16} className="mr-1" />
                                  <span>{course.students} students enrolled</span>
                                </div>
                              )}
                              
                                {course.status.toLowerCase() === "rejected" && course.rejectionReason && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                                  <p className="font-semibold text-red-800">Rejection Reason:</p>
                                  <p className="text-red-700">{course.rejectionReason}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                                {course.status.toLowerCase() === "approved" && (
                                <Button variant="outline" size="sm" onClick={() => navigate(`/courses/${course.id}`)}>
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              )}
                              <Button 
                                  variant={course.status.toLowerCase() === "rejected" ? "default" : "outline"}
                                size="sm" 
                                onClick={() => handleViewCourse(course.id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    {tab === "all" 
                      ? "Create your first course to get started"
                      : `You don't have any ${tab} courses`}
                  </p>
                  {tab === "all" && (
                    <Link to="/teacher/create-course">
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Course
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyCoursesPage;
