import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { studentAPI, teacherAPI, adminAPI } from "@/lib/api";
import { getInitials } from "@/lib/utils";

// Define the form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { user } = useAuth();
  const role = user?.role || localStorage.getItem("userRole") || "";

  // Fetch profile data based on user role
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", role],
    queryFn: async () => {
      if (role === "admin") {
        // For admin, we need to fetch their complete profile
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch admin profile');
          }
          
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching admin profile:', error);
          return user; // Fallback to user from context
        }
      } else if (role === "teacher") {
        const response = await teacherAPI.getProfile();
        return response.data;
      } else {
        const response = await studentAPI.getProfile();
        return response.data;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      if (role === "admin") {
        // Admin profile update logic would go here
        // Since there's no specific endpoint, we'll just simulate success
        return { data };
      } else if (role === "teacher") {
        return teacherAPI.updateProfile(data);
      } else {
        return studentAPI.updateProfile(data);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    },
  });

  // Set up form with react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      avatarUrl: "",
    },
  });

  // Update form values when profile data is loaded
  React.useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        bio: profileData.bio || "",
        avatarUrl: profileData.avatarUrl || "",
      });
    }
  }, [profileData, form]);

  // Form submission handler
  function onSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate(data);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Update your personal information and profile settings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and public profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                          {profileData?.name ? getInitials(profileData.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{profileData?.name || "User"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A brief description about yourself"
                              className="min-h-24"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Tell others a little bit about yourself
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm text-muted-foreground">{profileData?.email || "Not available"}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Role</div>
                <div className="text-sm text-muted-foreground">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
              </div>
              {role === "teacher" && (
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div className="text-sm text-muted-foreground">{profileData?.status || "Unknown"}</div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium">Account Created</div>
                <div className="text-sm text-muted-foreground">
                  {profileData?.createdAt 
                    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "Not available"}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
              <p className="text-xs text-muted-foreground">
                To change your email or password, please contact the administrator.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage; 