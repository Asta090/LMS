import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Star, Loader2, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";

const ReviewApprovalPage = () => {
  const queryClient = useQueryClient();
  
  // Fetch pending reviews from the backend
  const { data: pendingReviews, isLoading, isError } = useQuery({
    queryKey: ["adminPendingReviews"],
    queryFn: async () => {
      const response = await adminAPI.getReviews("pending");
      return response.data;
    },
  });

  // Mutation for approving a review
  const approveMutation = useMutation({
    mutationFn: (reviewId: string) => adminAPI.updateReviewStatus(reviewId, "approved"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPendingReviews"] });
      toast.success("Review approved successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve review");
    }
  });

  // Mutation for rejecting a review
  const rejectMutation = useMutation({
    mutationFn: (reviewId: string) => adminAPI.updateReviewStatus(reviewId, "rejected"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPendingReviews"] });
      toast.success("Review rejected");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject review");
    }
  });

  const handleApprove = (reviewId: string) => {
    approveMutation.mutate(reviewId);
  };

  const handleReject = (reviewId: string) => {
    rejectMutation.mutate(reviewId);
  };

  const renderRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Layout hasSidebar role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Review Approval</h1>
          <p className="text-muted-foreground">
            Review and approve student feedback
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load reviews. Please try again later.
            </AlertDescription>
          </Alert>
        ) : pendingReviews && pendingReviews.length > 0 ? (
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <Card key={review._id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="font-semibold text-lg">{review.course.title}</h3>
                      <p className="text-sm text-muted-foreground">Teacher: {review.course.teacher?.name || "Unknown"}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-sm mr-2">Student: {review.student?.name || "Unknown"}</p>
                        <div className="flex">
                          {renderRatingStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted on {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 self-end sm:self-start">
                    <Button 
                      variant="outline" 
                      onClick={() => handleReject(review._id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
                      disabled={rejectMutation.isPending}
                    >
                      {rejectMutation.isPending && rejectMutation.variables === review._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                      <X className="mr-2 h-4 w-4" />
                      )}
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleApprove(review._id)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={approveMutation.isPending}
                    >
                      {approveMutation.isPending && approveMutation.variables === review._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                      <Check className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No pending reviews</h3>
            <p className="text-muted-foreground">
              All student reviews have been processed
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReviewApprovalPage;
