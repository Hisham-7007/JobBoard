"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search,
  Users,
  Briefcase,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Rocket,
} from "lucide-react";
import { Header } from "@/components/Header";
import { JobListings } from "@/components/JobListings";
import { JobCarousel } from "@/components/JobCarousel";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchJobs = async (params: any) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?${queryParams}`
    );
    const data = await response.json();

    if (response.ok) {
      const enhancedJobs = data.jobs.map((job: any) => ({
        ...job,
        salary: "$90,000 - $120,000",
        applicants: Math.floor(Math.random() * 100) + 1,
        matchScore: Math.floor(Math.random() * 30) + 70,
        longDescription:
          job.description +
          " " +
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.",
        remote: Math.random() > 0.5,
      }));
      return { jobs: enhancedJobs, pagination: data.pagination };
    }
    throw new Error("Failed to fetch jobs");
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Matching",
      description: "Advanced algorithms find your perfect role",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Verified Opportunities",
      description: "All companies are thoroughly vetted",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Career Acceleration",
      description: "Fast-track your professional growth",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Network",
      description: "Connect with worldwide opportunities",
      color: "from-blue-400 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 transition-all duration-1000"
          style={{
            transform: `translate(${-mousePosition.x * 0.01}px, ${
              -mousePosition.y * 0.01
            }px)`,
          }}
        ></div>
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section with Unique Layout */}
      <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4 sm:px-6">
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight">
                <span className="text-gray-900">Your</span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  Dream Job
                </span>
                <br />
                <span className="text-gray-900">Awaits</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 leading-relaxed max-w-lg">
                Connect with top employers and discover opportunities that match
                your skills and aspirations. Your next career move starts here.
              </p>

              {/* Unique Search Interface */}
              <div className="relative mb-8 md:mb-12">
                <div
                  className={`transition-all duration-500 ${
                    searchFocused ? "scale-105" : "scale-100"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-white rounded-2xl p-1 sm:p-2 border-2 border-transparent hover:border-purple-200 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1 flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 w-full">
                        <Search
                          className={`h-5 w-5 transition-colors duration-300 ${
                            searchFocused ? "text-purple-500" : "text-gray-400"
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="What's your dream role?"
                          className="flex-1 text-gray-700 placeholder-gray-400 outline-none text-base sm:text-lg w-full"
                          onFocus={() => setSearchFocused(true)}
                          onBlur={() => setSearchFocused(false)}
                        />
                      </div>
                      <Link href="/jobs" className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center sm:justify-start space-x-2 font-medium"
                        >
                          <span>Browse Jobs</span>
                          <Rocket className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    number: "10K+",
                    label: "Live Jobs",
                    icon: <Briefcase className="h-4 w-4" />,
                  },
                  {
                    number: "5K+",
                    label: "Companies",
                    icon: <Users className="h-4 w-4" />,
                  },
                  {
                    number: "50K+",
                    label: "Job Seekers",
                    icon: <Users className="h-4 w-4" />,
                  },
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <div className="text-purple-500 mb-1 sm:mb-2 flex justify-center">
                        {stat.icon}
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-gray-600 text-xs sm:text-sm">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Job Carousel */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative h-64 sm:h-80 md:h-96">
                <JobCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Grid */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Why Choose JobBoard?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              We make job searching simple, efficient, and successful with our
              powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200/50 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] sm:hover:scale-105 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl sm:rounded-3xl from-purple-500 to-pink-500"></div>

                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 transform transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>

                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <ArrowRight className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expandable Job Cards Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-4 sm:space-y-6">
            <JobListings fetchJobs={fetchJobs} />
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link href="/jobs">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 font-medium"
              >
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-12 md:py-16 px-4 sm:px-6 bg-white/60 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-100 rounded-xl flex items-center justify-center transform rotate-12">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-black transform -rotate-12" />
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  JobBoard
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-md mb-4 md:mb-6">
                Connecting talented professionals with amazing opportunities.
                Find your perfect role today.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-purple-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.014-.627.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-purple-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-purple-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                For Job Seekers
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="/jobs"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Create Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Job Alerts
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Career Advice
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                For Employers
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Browse Candidates
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Recruiting Solutions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Company
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm sm:text-base text-gray-600 hover:text-purple-500 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 md:pt-8 border-t border-gray-200/50">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-xs sm:text-sm mb-3 md:mb-0">
                © {new Date().getFullYear()} Hisham Ibrahim. All rights
                reserved.
              </p>
              <div className="flex space-x-4 sm:space-x-6">
                <Link
                  href="/privacy"
                  className="text-gray-500 hover:text-purple-500 text-xs sm:text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-purple-500 text-xs sm:text-sm transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-purple-500 text-xs sm:text-sm transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
