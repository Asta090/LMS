import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Layers, BookMarked, Users, BookText, Lightbulb, BarChart, Mail } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col dark bg-[#121212] text-[#EEEEEE]">
      {/* Nav Bar */}
      <nav className="fixed w-full z-10 backdrop-blur-md bg-[#121212]/80 border-b border-[#333333]">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl">LearnSphere</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-[#2A2A2A] text-[#EEEEEE]">Log In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-[#121212] to-[#1A1A1A]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-primary">Modern</span> Learning<br />for the Digital Age
              </h1>
              <p className="text-xl text-[#AAAAAA] max-w-xl">
                Discover a powerful platform designed for students, educators and institutions to connect, learn, and grow together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?role=student">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/register?role=teacher">
                  <Button size="lg" variant="outline" className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A] w-full sm:w-auto">
                    Become an Instructor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-30"></div>
                <div className="relative bg-[#1E1E1E] rounded-xl p-8 shadow-xl border border-[#333333] aspect-square max-w-md flex items-center justify-center">
                  <BookMarked className="h-32 w-32 text-primary/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-[#151515] border-y border-[#333333]">
        <div className="container mx-auto px-4">
          <p className="text-center text-[#777777] text-lg mb-8">Trusted by learners from</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {/* Microsoft Logo */}
            <div className="flex items-center">
              <div className="grid grid-cols-2 gap-0.5 mr-2">
                <div className="w-4 h-4 bg-[#F25022]"></div>
                <div className="w-4 h-4 bg-[#7FBA00]"></div>
                <div className="w-4 h-4 bg-[#00A4EF]"></div>
                <div className="w-4 h-4 bg-[#FFB900]"></div>
              </div>
              <span className="text-xl text-[#777777] font-medium ml-1">Microsoft</span>
            </div>
            
            {/* Walmart Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#0071CE]">Walmart</span>
              <span className="text-[#FFC220] text-2xl ml-0.5">*</span>
            </div>
            
            {/* Accenture Logo */}
            <div className="flex items-center">
              <span className="text-xl font-normal text-[#777777]">accenture</span>
              <span className="text-[#A100FF] ml-0.5 text-2xl">{'>'}</span>
            </div>
            
            {/* Adobe Logo */}
            <div className="flex items-center">
              <div className="w-6 h-6 bg-[#FF0000] flex items-center justify-center mr-1">
                <div className="w-3 h-3 bg-white"></div>
              </div>
              <span className="text-xl font-bold text-[#FF0000]">Adobe</span>
            </div>
            
            {/* PayPal Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-[#253B80]">Pay</span>
              <span className="text-xl font-bold text-[#179BD7]">Pal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-[#AAAAAA] max-w-2xl mx-auto">Our learning platform is designed to provide a seamless experience for all users</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333] hover:border-primary/50 transition-all">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Students</h3>
              <p className="text-[#AAAAAA]">
                Access a diverse library of courses, track your progress, and connect with instructors for a personalized learning experience.
              </p>
            </div>
            
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333] hover:border-primary/50 transition-all">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Teachers</h3>
              <p className="text-[#AAAAAA]">
                Create and manage courses, track student progress, and build your teaching profile to reach a global audience.
              </p>
            </div>
            
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333] hover:border-primary/50 transition-all">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Admins</h3>
              <p className="text-[#AAAAAA]">
                Comprehensive tools to manage users, monitor platform activity, and ensure quality content through approval systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#151515]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-[#AAAAAA] max-w-2xl mx-auto">Join our platform in just a few simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute top-0 right-0 -mr-3 -mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold">1</div>
              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333] h-full">
                <h3 className="text-xl font-semibold mb-4">Sign Up</h3>
                <p className="text-[#AAAAAA] mb-4">
                  Create your account as a student or apply as a teacher to get started on your learning journey.
                </p>
                <Link to="/register" className="text-primary hover:text-primary/80 inline-flex items-center">
                  Create Account <Lightbulb className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 right-0 -mr-3 -mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold">2</div>
              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333] h-full">
                <h3 className="text-xl font-semibold mb-4">Browse Courses</h3>
                <p className="text-[#AAAAAA] mb-4">
                  Explore our extensive catalog of courses across various subjects and skill levels.
                </p>
                <Link to="/login" className="text-primary hover:text-primary/80 inline-flex items-center">
                  Explore Courses <Lightbulb className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 right-0 -mr-3 -mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold">3</div>
              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333] h-full">
                <h3 className="text-xl font-semibold mb-4">Learn & Grow</h3>
                <p className="text-[#AAAAAA] mb-4">
                  Engage with course materials, complete assignments, and track your progress to achieve your goals.
                </p>
                <Link to="/register" className="text-primary hover:text-primary/80 inline-flex items-center">
                  Get Started <Lightbulb className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#121212] to-[#1A1A1A]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
            <p className="text-[#AAAAAA] text-xl mb-8">
              Join thousands of students and educators already using our platform to achieve their goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  Create an Account
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-[#444444] text-[#EEEEEE] hover:bg-[#2A2A2A] w-full sm:w-auto">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#121212] border-t border-[#333333]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-lg">LearnSphere</span>
              </div>
              <p className="text-[#AAAAAA] text-sm">
                The modern learning platform for students and educators.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-[#AAAAAA]">
                <li><Link to="/login" className="hover:text-primary">Browse Courses</Link></li>
                <li><Link to="/register?role=teacher" className="hover:text-primary">Become an Instructor</Link></li>
                <li><Link to="/register" className="hover:text-primary">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-primary">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-[#AAAAAA]">
                <li><Link to="/login" className="hover:text-primary">Help Center</Link></li>
                <li><Link to="/login" className="hover:text-primary">Community</Link></li>
                <li><Link to="/login" className="hover:text-primary">Feedback</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="flex items-center gap-2 text-[#AAAAAA] mb-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@learnsphere.com</span>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#333333] text-center text-[#AAAAAA] text-sm">
            <p>© {new Date().getFullYear()} LearnSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
