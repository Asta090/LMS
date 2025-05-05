import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate, getInitials, getStatusInfo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const TeacherApprovalPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  
  // Fetch teachers based on the active tab
  const { data: teachers, isLoading } = useQuery({
    queryKey: ["teachers", activeTab],
    queryFn: async () => {
      const response = await adminAPI.getTeachers(activeTab);
      return response.data;
    },
  });
  
  // Mutation for updating teacher status
  const updateTeacherStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      adminAPI.updateTeacherStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("Teacher status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update teacher status");
    },
  });
  
  const handleApprove = (id: string) => {
    updateTeacherStatus.mutate({ id, status: "approved" });
  };
  
  const handleReject = (id: string) => {
    updateTeacherStatus.mutate({ id, status: "rejected" });
  };
  
  const renderTeachers = () => {
    if (isLoading) {
      return Array(5).fill(0).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </TableCell>
        </TableRow>
      ));
    }
    
    if (!teachers || teachers.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
            No {activeTab} teachers found
          </TableCell>
        </TableRow>
      );
    }
    
    return teachers.map((teacher: any) => {
      const isPending = teacher.status === "pending";
      const statusInfo = getStatusInfo(teacher.status);
      
      return (
        <TableRow key={teacher._id}>
          <TableCell>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {getInitials(teacher.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{teacher.name}</p>
                <p className="text-sm text-muted-foreground">{teacher.email}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            {teacher.createdAt ? formatDate(teacher.createdAt) : "N/A"}
          </TableCell>
          <TableCell>
            <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
              {statusInfo.label}
            </Badge>
          </TableCell>
          <TableCell>
            {isPending ? (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(teacher._id)}
                  disabled={updateTeacherStatus.isPending}
                  className="flex items-center space-x-1"
                >
                  {updateTeacherStatus.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>Approve</span>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(teacher._id)}
                  disabled={updateTeacherStatus.isPending}
                  className="flex items-center space-x-1"
                >
                  {updateTeacherStatus.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span>Reject</span>
                </Button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {teacher.status === "approved" ? "Approved by admin" : "Rejected by admin"}
              </div>
            )}
          </TableCell>
        </TableRow>
      );
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Teacher Approvals</h1>
          <p className="text-muted-foreground">
            Manage teacher registration requests
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Teachers</CardTitle>
            <CardDescription>
              Review and approve teacher registration requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Registered On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderTeachers()}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherApprovalPage;
