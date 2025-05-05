import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { formatDate, getStatusInfo, truncateText } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const CourseApprovalPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  
  // Fetch courses based on the active tab
  const { data: courses, isLoading } = useQuery({
    queryKey: ["adminCourses", activeTab],
    queryFn: async () => {
      const response = await adminAPI.getCourses(activeTab);
      return response.data;
    },
  });
  
  // Mutation for updating course status
  const updateCourseStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      adminAPI.updateCourseStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("Course status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update course status");
    },
  });
  
  const handleApprove = (id: string) => {
    updateCourseStatus.mutate({ id, status: "approved" });
  };
  
  const handleReject = (id: string) => {
    updateCourseStatus.mutate({ id, status: "rejected" });
  };
  
  const renderCourses = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full pr-4">
              <Skeleton className="h-5 w-52" />
              <div className="flex gap-3 mt-2 md:mt-0">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ));
    }
    
    if (!courses || courses.length === 0) {
      return (
        <div className="py-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No {activeTab} courses found</h3>
          <p className="text-muted-foreground">
            {activeTab === "pending" 
              ? "There are no courses waiting for approval." 
              : `No courses have been ${activeTab} yet.`}
          </p>
        </div>
      );
    }
    
    return courses.map((course: any) => {
      const isPending = course.status === "pending";
      const statusInfo = getStatusInfo(course.status);
      
      return (
        <AccordionItem key={course._id} value={course._id}>
          <AccordionTrigger>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full pr-4">
              <span className="font-medium text-left">{course.title}</span>
              <div className="flex gap-3 mt-2 md:mt-0">
                <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                  {statusInfo.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  by {course.teacher?.name || "Unknown Teacher"}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-1">Submitted</h4>
                <p className="text-sm text-muted-foreground">
                  {course.createdAt ? formatDate(course.createdAt) : "N/A"}
                </p>
              </div>
              
              {isPending && (
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(course._id)}
                    disabled={updateCourseStatus.isPending}
                    className="flex items-center space-x-1"
                  >
                    {updateCourseStatus.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span>Reject</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(course._id)}
                    disabled={updateCourseStatus.isPending}
                    className="flex items-center space-x-1"
                  >
                    {updateCourseStatus.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span>Approve</span>
                  </Button>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Course Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve courses submitted by teachers
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>
              Review course submissions and approve or reject them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
                    
              <Accordion type="single" collapsible className="w-full">
                {renderCourses()}
              </Accordion>
            </Tabs>
          </CardContent>
              </Card>
      </div>
    </DashboardLayout>
  );
};

export default CourseApprovalPage;
