import React from "react";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <Layout>
      <div className="container max-w-md mx-auto py-12">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <div className="border rounded-lg p-8 shadow-sm bg-[#1A1A1A] border-[#333333]">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
