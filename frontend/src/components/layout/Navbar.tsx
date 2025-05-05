import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Layers } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-10 backdrop-blur-md bg-[#121212]/80 border-b border-[#333333]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-xl text-[#EEEEEE]">LearnSphere</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link 
              to="/"
              className="px-3 py-2 text-sm font-medium text-[#EEEEEE] hover:text-primary"
            >
              Home
            </Link>
            <Link 
              to="/courses"
              className="px-3 py-2 text-sm font-medium text-[#EEEEEE] hover:text-primary"
            >
              Courses
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="hover:bg-[#2A2A2A] text-[#EEEEEE]">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#EEEEEE] hover:text-primary"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-[#121212] pb-3 px-2 animate-fade-in">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-[#EEEEEE] hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="block px-3 py-2 text-base font-medium text-[#EEEEEE] hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Courses
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 text-base font-medium text-[#EEEEEE] hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="block px-3 py-2 text-base font-medium text-[#EEEEEE] hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
