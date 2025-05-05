import React from "react";
import Layout from "@/components/layout/Layout";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <Layout>
      <div className="container max-w-md mx-auto py-12">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">
            Enter your information to create your account
          </p>
        </div>
        <div className="border rounded-lg p-8 shadow-sm bg-[#1A1A1A] border-[#333333]">
          <RegisterForm />
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
