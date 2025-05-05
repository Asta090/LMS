import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { teacherAPI } from "@/lib/api";
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
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// Form schema for course creation
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }).max(1000, {
    message: "Description must not exceed 1000 characters."
  }),
});

const CreateCoursePage = () => {
  const navigate = useNavigate();
  
  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  
  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => 
      teacherAPI.createCourse(data),
    onSuccess: () => {
      toast.success("Course created successfully! It's pending admin approval.");
      navigate("/teacher/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create course");
    },
  });
  
  // Form submission handler
  function onSubmit(data: z.infer<typeof formSchema>) {
    createCourseMutation.mutate(data);
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create a New Course</h1>
          <p className="text-muted-foreground">
            Fill in the details to create a new course. It will be reviewed by an admin before being published.
          </p>
        </div>
        
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Provide information about your course
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
                        <Input 
                          placeholder="e.g., Introduction to Web Development" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, concise title for your course
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
                          placeholder="Describe what students will learn in this course..." 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A detailed description of the course content, learning objectives, and who it's for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {createCourseMutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      There was an error creating your course. Please try again.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/teacher/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createCourseMutation.isPending}
                  >
                    {createCourseMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Course"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="bg-muted/50 text-sm text-muted-foreground">
            Note: All new courses require admin approval before they become visible to students.
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateCoursePage;
