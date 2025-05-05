import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { studentAPI } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Search, GraduationCap, BookOpen, AlertCircle } from "lucide-react";
import { truncateText, getInitials } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BrowseCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  
  // Fetch all approved courses
  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await studentAPI.getAllCourses();
      return response.data;
    },
  });
  
  // Filter courses based on search query
  const filteredCourses = courses?.filter((course: any) => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.teacher?.name && course.teacher.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];
  
  // Sort courses based on selected criteria
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "rating") {
      const ratingA = a.stats?.averageRating || 0;
      const ratingB = b.stats?.averageRating || 0;
      return ratingB - ratingA;
    }
    // Default to newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // Generate course cards
  const renderCourseCards = () => {
    if (isLoading) {
      return Array(6).fill(0).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="h-32 bg-muted"></div>
          <CardHeader className="p-4">
            <Skeleton className="h-6 w-4/5 mb-2" />
            <Skeleton className="h-4 w-3/5" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Skeleton className="h-16 w-full" />
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-1/3" />
          </CardFooter>
        </Card>
      ));
    }
    
    if (isError) {
      return (
        <div className="col-span-3">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load courses. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    
    if (sortedCourses.length === 0) {
      return (
        <div className="col-span-3 py-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 
              "No courses match your search criteria. Try a different search term." : 
              "There are no courses available at the moment."}
          </p>
        </div>
      );
    }
    
    return sortedCourses.map((course: any) => (
      <Card key={course._id} className="overflow-hidden flex flex-col">
        <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary/70" />
        </div>
        <CardHeader className="p-4">
          <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>
              {course.teacher?.name || "Teacher"}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateText(course.description, 120)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center">
            {course.stats?.averageRating > 0 ? (
              <>
                <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
                <span className="text-sm font-medium">
                  {course.stats.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({course.stats.totalReviews})
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">No ratings yet</span>
            )}
          </div>
          <Link to={`/courses/${course._id}`}>
            <Button size="sm">View Course</Button>
          </Link>
        </CardFooter>
      </Card>
    ));
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Browse Courses</h1>
          <p className="text-muted-foreground">
            Discover courses and enhance your skills
          </p>
        </div>
        
        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select 
            value={sortBy} 
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderCourseCards()}
        </div>
        
        {!isLoading && !isError && sortedCourses.length > 0 && (
          <div className="flex justify-center pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {sortedCourses.length} {sortedCourses.length === 1 ? 'course' : 'courses'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BrowseCoursesPage;
