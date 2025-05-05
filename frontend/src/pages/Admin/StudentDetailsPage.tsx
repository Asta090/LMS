import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ChevronLeft, Loader2, AlertCircle, 
  CalendarDays, BookOpen, Star, User 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminAPI } from "@/lib/api";
import { formatDate, getInitials } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch student details
  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentDetails", id],
    queryFn: async () => {
      if (!id) throw new Error("Student ID is required");
      const response = await adminAPI.getStudentDetails(id);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout hasSidebar role="admin">
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (isError || !data) {
    return (
      <Layout hasSidebar role="admin">
        <div className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load student details. Please try again later.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link to="/admin/students">
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Students
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { student, enrollments, reviews, stats } = data;

  return (
    <Layout hasSidebar role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link to="/admin/students" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to All Students
            </Link>
            <h1 className="text-3xl font-bold">Student Profile</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Student Information */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">
                  {getInitials(student.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-muted-foreground mb-4">{student.email}</p>
              
              {student.bio && (
                <div className="mt-4 w-full text-left">
                  <h3 className="font-medium mb-1">Bio</h3>
                  <p className="text-sm">{student.bio}</p>
                </div>
              )}
              
              <div className="w-full mt-6 space-y-3 text-left">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground mr-2">ID:</span>
                    {student._id}
                  </span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground mr-2">Joined:</span>
                    {formatDate(student.createdAt)}
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground mr-2">Enrolled Courses:</span>
                    {stats.totalEnrollments}
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground mr-2">Reviews Written:</span>
                    {stats.totalReviews}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrollments and Reviews */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <Tabs defaultValue="enrollments">
                <TabsList className="w-full">
                  <TabsTrigger value="enrollments" className="flex-1">
                    Enrollments
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">
                    Reviews
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-2">
              <TabsContent value="enrollments" className="mt-0">
                {enrollments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Enrolled On</TableHead>
                        <TableHead className="text-right">Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment._id}>
                          <TableCell className="font-medium">
                            {enrollment.course.title}
                          </TableCell>
                          <TableCell>
                            {enrollment.course.teacher?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            {formatDate(enrollment.joinedAt)}
                          </TableCell>
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
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      This student hasn't enrolled in any courses yet
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review._id} className="border bg-muted/30">
                        <CardContent className="pt-6">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">{review.course.title}</h3>
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
                          <div className="mt-2 flex justify-between">
                            <p className="text-xs text-muted-foreground">
                              Submitted on {formatDate(review.createdAt)}
                            </p>
                            <Badge variant={review.status === "approved" ? "default" : 
                                          review.status === "rejected" ? "destructive" : "outline"}>
                              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      This student hasn't submitted any reviews yet
                    </p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDetailsPage; 