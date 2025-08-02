// components/JobCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, TrendingUp, ChevronRight } from "lucide-react";

interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  experience: string;
  skills: string[];
  createdAt: string;
  postedBy: {
    name: string;
  };
  salary?: string;
  applicants?: number;
  matchScore?: number;
  longDescription?: string;
  remote?: boolean;
  trending?: boolean;
  companyColor?: string;
}

export function JobCarousel() {
  const [activeJobIndex, setActiveJobIndex] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarouselJobs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?limit=3`
        );
        const data = await response.json();

        if (response.ok) {
          const enhancedJobs = data.jobs.map((job: Job) => ({
            ...job,
            salary: "$90,000 - $120,000", // Mock salary
            applicants: Math.floor(Math.random() * 100) + 1,
            matchScore: Math.floor(Math.random() * 30) + 70,
            trending: Math.random() > 0.5,
            companyColor: getRandomGradient(),
          }));
          setJobs(enhancedJobs);
        }
      } catch (error) {
        console.error("Error fetching carousel jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      const interval = setInterval(() => {
        setActiveJobIndex((prev) => (prev + 1) % jobs.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [jobs]);

  const getRandomGradient = () => {
    const gradients = [
      "from-purple-400 to-pink-400",
      "from-blue-400 to-cyan-400",
      "from-orange-400 to-red-400",
      "from-green-400 to-teal-400",
      "from-yellow-400 to-amber-400",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="relative h-96 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 animate-pulse">
        {/* Loading skeleton */}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="relative h-96 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 flex items-center justify-center">
        <p className="text-gray-600">No featured jobs available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative h-96">
        {jobs.map((job, index) => (
          <div
            key={job._id}
            className={`absolute inset-0 transition-all duration-700 transform ${
              index === activeJobIndex
                ? "translate-x-0 opacity-100 scale-100 z-20 pointer-events-auto"
                : index < activeJobIndex
                ? "-translate-x-full opacity-0 scale-95 z-10 pointer-events-none"
                : "translate-x-full opacity-0 scale-95 z-10 pointer-events-none"
            }`}
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${job.companyColor} rounded-2xl flex items-center justify-center text-white text-2xl font-bold`}
                  >
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-purple-600 font-medium">{job.company}</p>
                  </div>
                </div>
                {job.trending && (
                  <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>HOT</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{formatDate(job.createdAt)}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed line-clamp-1">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {job.salary}
                  </div>
                  <div className="text-sm text-gray-500">
                    {job.applicants} applicants
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Match Score</div>
                    <div className="text-lg font-bold text-green-600">
                      {job.matchScore}%
                    </div>
                  </div>
                  <Link href={`/jobs/${job._id}`}>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 font-medium">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Controls */}
      <div className="flex items-center justify-center space-x-3 mt-8">
        {jobs.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveJobIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeJobIndex
                ? "bg-purple-500 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
