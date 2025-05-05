import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentAPI } from "@/lib/api";
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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Star, BookOpen, CheckCircle, GraduationCap, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getInitials, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Review form schema
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters.",
  }).max(500, {
    message: "Comment must not exceed 500 characters."
  }),
});

const StarRating = ({ 
  value, 
  onChange, 
  disabled = false 
}: { 
  value: number; 
  onChange?: (value: number) => void; 
  disabled?: boolean;
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
          onMouseEnter={() => !disabled && setHoverValue(star)}
          onMouseLeave={() => !disabled && setHoverValue(0)}
          onClick={() => !disabled && onChange && onChange(star)}
          disabled={disabled}
        >
          <Star 
            className={`h-6 w-6 ${
              (hoverValue || value) >= star
                ? "text-amber-500 fill-amber-500"
                : "text-gray-300"
            }`} 
          />
        </button>
      ))}
    </div>
  );
};

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  // Fetch course details
  const { 
    data: courseData, 
    isLoading,
    isError,
    error 
  } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await studentAPI.getCourseDetail(id!);
      return response.data;
    },
    enabled: !!id,
  });
  
  // Enroll in course mutation
  const enrollMutation = useMutation({
    mutationFn: () => studentAPI.enrollCourse(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      queryClient.invalidateQueries({ queryKey: ["studentEnrollments"] });
      toast.success("Successfully enrolled in the course!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to enroll in course");
    },
  });
  
  // Submit review form
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
    comment: "",
    },
  });
  
  // Submit review mutation
  const reviewMutation = useMutation({
    mutationFn: (data: z.infer<typeof reviewSchema>) => 
      studentAPI.submitReview(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      queryClient.invalidateQueries({ queryKey: ["studentReviews"] });
      setReviewDialogOpen(false);
      form.reset();
      toast.success("Review submitted successfully! It will be visible after admin approval.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });

  // Handle enrolling in course
  const handleEnroll = () => {
    enrollMutation.mutate();
  };

  // Handle review submission
  const onSubmitReview = (data: z.infer<typeof reviewSchema>) => {
    reviewMutation.mutate(data);
  };
  
  if (isLoading) {
  return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-7 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Skeleton className="h-7 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-7 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (isError) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(error as any)?.response?.data?.message || "Failed to load course details"}
          </AlertDescription>
        </Alert>
        
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Could not load course</h3>
          <p className="text-muted-foreground mb-6">
            The course might not exist or you might not have permission to view it.
          </p>
          <Link to="/student/browse-courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  const { course, reviews, isEnrolled, hasReviewed, stats } = courseData;
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{course.title}</h1>
          </div>
          <p className="text-muted-foreground flex items-center">
            <GraduationCap className="inline-block mr-1 h-4 w-4" />
            Instructor: {course.teacher?.name || "Unknown Teacher"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this Course</CardTitle>
                <CardDescription>
                  Detailed information about what you'll learn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{course.description}</p>
              </CardContent>
            </Card>
            
            {/* Course Reviews */}
              <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                  <CardTitle>Reviews</CardTitle>
                  <CardDescription>
                    {stats.totalReviews
                      ? `${stats.totalReviews} student ${stats.totalReviews === 1 ? 'review' : 'reviews'} • ${stats.averageRating.toFixed(1)} average rating`
                      : "No reviews yet"}
                  </CardDescription>
                    </div>
                    
                {isEnrolled && !hasReviewed && (
                  <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Write a Review</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Write a Review</DialogTitle>
                        <DialogDescription>
                          Share your experience about this course to help other students
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitReview)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <FormControl>
                                  <StarRating
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                      <Textarea 
                                    placeholder="What did you like or dislike about this course?"
                                    className="min-h-32"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Your review will be visible after admin approval
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button 
                              type="submit" 
                              disabled={reviewMutation.isPending}
                            >
                              {reviewMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                "Submit Review"
                              )}
                            </Button>
                          </DialogFooter>
                  </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
            )}
            
                {hasReviewed && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button variant="outline" disabled>
                            Review Submitted
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You've already submitted a review for this course</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </CardHeader>
              
              <CardContent>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div key={review._id} className="pb-6 border-b last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(review.student?.name || "User")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {review.student?.name || "Anonymous"}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <StarRating value={review.rating} disabled />
                              <span className="ml-2">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      This course doesn't have any reviews yet
                    </p>
                      </div>
                )}
                    </CardContent>
                  </Card>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created on</span>
                  <span>{formatDate(course.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
                    <span>{stats.averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reviews</span>
                  <span>{stats.totalReviews}</span>
                </div>
                
                <Separator />
                
                {isEnrolled ? (
                  <div className="text-center">
                    <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 mb-4">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Enrolled
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      You are already enrolled in this course
                    </p>
                    <Link to="/student/my-courses">
                      <Button variant="outline" className="w-full">
                        Go to My Courses
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                  >
                    {enrollMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      "Enroll Now"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
            </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailPage;
