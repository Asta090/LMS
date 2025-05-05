import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Pencil,
  Users,
  Star,
  CalendarDays,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { teacherAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CourseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch course details
  const { data, isLoading, isError } = useQuery({
    queryKey: ["teacherCourseDetails", id],
    queryFn: async () => {
      if (!id) throw new Error("Course ID is required");
      const response = await teacherAPI.getCourse(id);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !data) {
    return (
      <DashboardLayout>
        <div className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load course details. Please try again later.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate("/teacher/dashboard")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { course, enrollments, reviews, stats } = data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link to="/teacher/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">{course.title}</h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/teacher/courses/${course._id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Course
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Course Information */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-1">Status</h3>
                <Badge variant={course.status === "approved" ? "default" : "outline"}>
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </Badge>
                {course.status === "pending" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    This course is waiting for admin approval
                  </p>
                )}
                {course.status === "rejected" && course.rejectionReason && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="font-medium text-sm text-red-800">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{course.rejectionReason}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium text-sm mb-1">Created On</h3>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formatDate(course.createdAt)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-1">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-2xl font-bold">{stats.totalEnrollments}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Students</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-2xl font-bold">
                        {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Avg. Rating</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm whitespace-pre-line">{course.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrollments and Reviews */}
          <Card className="md:col-span-3">
            <CardHeader>
              <Tabs defaultValue="enrollments">
                <TabsList className="w-full">
                  <TabsTrigger value="enrollments" className="flex-1">
                    Student Enrollments ({enrollments.length})
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">
                    Student Reviews ({reviews.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="enrollments" className="mt-0">
                {enrollments && enrollments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined On</TableHead>
                        <TableHead className="text-right">Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment._id}>
                          <TableCell className="font-medium">
                            {enrollment.student?.name || "Unknown Student"}
                          </TableCell>
                          <TableCell>{enrollment.student?.email || "N/A"}</TableCell>
                          <TableCell>{formatDate(enrollment.joinedAt)}</TableCell>
                          <TableCell className="text-right">
                            <Badge>
                              {enrollment.progress || 0}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No students enrolled in this course yet
                    </p>
                    {course.status !== "approved" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Students can enroll once your course is approved
                      </p>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review._id} className="border bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">{review.student?.name || "Anonymous Student"}</h3>
                            <div className="flex">
                              {Array(5).fill(0).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Submitted on {formatDate(review.createdAt)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No reviews for this course yet
                    </p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailsPage; 