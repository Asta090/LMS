import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  role: z.enum(["admin", "teacher", "student"], {
    required_error: "Please select a role.",
  }),
});

const LoginForm = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "student", // Default role
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null); // Clear previous errors
    
    try {
      setIsLoading(true);
      await login(values as { email: string; password: string; role: string });
    } catch (error: any) {
      console.error("Login error:", error);
      // Display error message
      setError(error.response?.data?.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-900/40 text-red-400 border-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#EEEEEE]">Login as</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border-[#444444] bg-[#2A2A2A] text-[#EEEEEE]">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#2A2A2A] border-[#444444]">
                  <SelectItem value="admin" className="text-[#EEEEEE] focus:bg-[#333333] focus:text-white">Admin</SelectItem>
                  <SelectItem value="teacher" className="text-[#EEEEEE] focus:bg-[#333333] focus:text-white">Teacher</SelectItem>
                  <SelectItem value="student" className="text-[#EEEEEE] focus:bg-[#333333] focus:text-white">Student</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#EEEEEE]">Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="john.doe@example.com" 
                  {...field} 
                  className="border-[#444444] bg-[#2A2A2A] text-[#EEEEEE] placeholder:text-[#888888]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#EEEEEE]">Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••" 
                  {...field} 
                  className="border-[#444444] bg-[#2A2A2A] text-[#EEEEEE]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">
            Forgot Password?
          </Link>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
          <div className="text-center text-sm text-[#AAAAAA]">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
