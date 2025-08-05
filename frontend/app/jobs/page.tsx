"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Eye,
  Plus,
  Minus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { JobListings } from "@/components/JobListings";

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
}

interface Pagination {
  current: number;
  pages: number;
  total: number;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "all",
    experience: "all",
  });
  const [savedJobs, setSavedJobs] = useState(new Set<string>());
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     fetchJobs();
  //   }, 500);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [pagination.current, filters]);

  // const fetchJobs = async () => {
  //   setLoading(true);
  //   try {
  //     const queryParams = new URLSearchParams({
  //       page: pagination.current.toString(),
  //       limit: "9",
  //       ...(filters.search && { search: filters.search }),
  //       ...(filters.location && { location: filters.location }),
  //       ...(filters.type && filters.type !== "all" && { type: filters.type }),
  //       ...(filters.experience &&
  //         filters.experience !== "all" && { experience: filters.experience }),
  //     });

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?${queryParams}`
  //     );
  //     const data = await response.json();

  //     if (response.ok) {
  //       // Enhance jobs data with mock details for the new design
  //       const enhancedJobs = data.jobs.map((job: Job) => ({
  //         ...job,
  //         salary: "$90,000 - $120,000", // Mock salary
  //         applicants: Math.floor(Math.random() * 100) + 1, // Random applicants count
  //         matchScore: Math.floor(Math.random() * 30) + 70, // Random match score 70-100
  //         longDescription:
  //           job.description +
  //           " " +
  //           "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.", // Extended description
  //         remote: Math.random() > 0.5, // Random remote status
  //         companyColor: getRandomGradient(), // Random company color gradient
  //       }));
  //       setJobs(enhancedJobs);
  //       setPagination(data.pagination);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching jobs:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const getRandomGradient = () => {
    const gradients = [
      "from-purple-500 to-blue-500",
      "from-pink-500 to-red-500",
      "from-green-500 to-teal-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-purple-500",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      type: "all",
      experience: "all",
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current: page }));
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

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.location ||
      filters.type !== "all" ||
      filters.experience !== "all"
    );
  };

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-white/40 backdrop-blur-sm">
      <Header />

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <JobListings fetchJobs={fetchJobs} />
        </div>
      </section>
    </div>
  );
}
