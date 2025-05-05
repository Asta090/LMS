import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { teacherAPI } from "@/lib/api";

// Define form schema
const courseFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

const EditCoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch course details
  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["teacherCourse", id],
    queryFn: async () => {
      if (!id) throw new Error("Course ID is required");
      const response = await teacherAPI.getCourse(id);
      return response.data;
    },
    enabled: !!id,
  });

  // Form setup
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Update form values when course data is loaded
  React.useEffect(() => {
    if (course) {
      form.reset({
        title: course.title,
        description: course.description,
      });
    }
  }, [course, form]);

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      if (!id) throw new Error("Course ID is required");
      return teacherAPI.updateCourse(id, data);
    },
    onSuccess: () => {
      toast.success("Course updated successfully");
      queryClient.invalidateQueries({ queryKey: ["teacherCourses"] });
      queryClient.invalidateQueries({ queryKey: ["teacherCourse", id] });
      queryClient.invalidateQueries({ queryKey: ["teacherCourseDetails", id] });
      navigate(`/teacher/courses/${id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update course");
    },
  });

  // Form submission handler
  const onSubmit = (data: CourseFormValues) => {
    updateCourseMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load course details"}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate("/teacher/my-courses")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to My Courses
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            className="mb-4 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(`/teacher/courses/${id}`)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Course Details
          </Button>
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground">
            Update your course information
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Edit the title and description of your course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course title" {...field} />
                      </FormControl>
                      <FormDescription>
                        A clear and concise title for your course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter course description"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of what students will learn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/teacher/courses/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateCourseMutation.isPending}
                  >
                    {updateCourseMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="bg-muted/50 border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Course updates will be reviewed by an admin if the course status is pending
            </p>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditCoursePage; 