import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Users } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  teacherName: string;
  students?: number;
  rating?: number;
  onAction?: () => void;
  actionText?: string;
  status?: "Pending" | "Approved" | "Rejected";
}

const CourseCard = ({
  title,
  description,
  teacherName,
  students = 0,
  rating = 0,
  onAction,
  actionText = "View Course",
  status,
}: CourseCardProps) => {
  return (
    <Card className="h-full flex flex-col bg-[#1A1A1A] border border-[#333333] hover:border-primary/50 transition-all">
      <CardHeader>
        {status && (
          <div className="flex justify-end mb-2">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs ${
                status === "Approved"
                  ? "bg-green-900/40 text-green-400"
                  : status === "Rejected"
                  ? "bg-red-900/40 text-red-400"
                  : "bg-yellow-900/40 text-yellow-400"
              }`}
            >
              {status}
            </span>
          </div>
        )}
        <CardTitle className="line-clamp-1 text-[#EEEEEE]">{title}</CardTitle>
        <CardDescription className="text-[#AAAAAA]">by {teacherName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-[#AAAAAA] line-clamp-3">{description}</p>
        
        {(students > 0 || rating > 0) && (
          <div className="flex items-center mt-4 space-x-4">
            {students > 0 && (
              <div className="flex items-center">
                <Users size={16} className="mr-1 text-[#AAAAAA]" />
                <span className="text-sm text-[#EEEEEE]">{students} students</span>
              </div>
            )}
            
            {rating > 0 && (
              <div className="flex items-center">
                <Star size={16} className="mr-1 text-yellow-500" />
                <span className="text-sm text-[#EEEEEE]">{rating.toFixed(1)}/5.0</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onAction} 
          variant="outline" 
          className="w-full border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A]"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          {actionText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
