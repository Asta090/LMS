import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Star, Loader2, AlertCircle } from "lucide-react";
import { studentAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const MyReviewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch student's reviews
  const { data: reviewsData, isLoading, isError } = useQuery({
    queryKey: ["studentReviews"],
    queryFn: async () => {
      const response = await studentAPI.getMyReviews();
      return response.data;
    },
  });

  // Filter reviews based on search query
  const filteredReviews = React.useMemo(() => {
    if (!reviewsData) return [];
    
    return reviewsData.filter((review) => 
      review.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reviewsData, searchQuery]);

  const renderRatingStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusBadge = (status) => {
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
    <Layout hasSidebar role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
          <p className="text-muted-foreground">
            Reviews you've submitted for courses
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your reviews..."
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
              Failed to load your reviews. Please try again later.
            </AlertDescription>
          </Alert>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{review.course?.title || "Unknown Course"}</h3>
                          {getStatusBadge(review.status)}
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex mr-2">
                            {renderRatingStars(review.rating)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Submitted on {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      
                      {review.status === "rejected" && review.rejectionReason && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                          <p className="font-semibold text-red-800">Rejection Reason:</p>
                          <p className="text-red-700">{review.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search query" : "You haven't submitted any course reviews yet"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyReviewsPage;
