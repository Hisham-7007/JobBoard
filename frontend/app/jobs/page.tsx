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

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [pagination.current, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current.toString(),
        limit: "9",
        ...(filters.search && { search: filters.search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.type && filters.type !== "all" && { type: filters.type }),
        ...(filters.experience &&
          filters.experience !== "all" && { experience: filters.experience }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?${queryParams}`
      );
      const data = await response.json();

      if (response.ok) {
        // Enhance jobs data with mock details for the new design
        const enhancedJobs = data.jobs.map((job: Job) => ({
          ...job,
          salary: "$90,000 - $120,000", // Mock salary
          applicants: Math.floor(Math.random() * 100) + 1, // Random applicants count
          matchScore: Math.floor(Math.random() * 30) + 70, // Random match score 70-100
          longDescription:
            job.description +
            " " +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.", // Extended description
          remote: Math.random() > 0.5, // Random remote status
          companyColor: getRandomGradient(), // Random company color gradient
        }));
        setJobs(enhancedJobs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Featured Opportunities
            </h2>
            <p className="text-xl text-gray-600">
              Discover some of the latest job openings from top companies.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm mb-8 border border-gray-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.experience}
                onValueChange={(value) =>
                  handleFilterChange("experience", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters() && (
              <div className="mt-4 flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-gray-200 p-8 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="flex space-x-4">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="w-24 h-10 bg-gray-200 rounded-xl"></div>
                      <div className="text-right">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="w-24 h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>

              {hasActiveFilters() ? (
                <>
                  <p className="text-gray-600 mb-2">
                    No jobs matching these filters:
                  </p>
                  <ul className="text-sm text-gray-500 mb-4 space-y-1">
                    {filters.search && <li>Search: "{filters.search}"</li>}
                    {filters.location && (
                      <li>Location: "{filters.location}"</li>
                    )}
                    {filters.type !== "all" && (
                      <li>Type: {filters.type.replace("-", " ")}</li>
                    )}
                    {filters.experience !== "all" && (
                      <li>Experience: {filters.experience}</li>
                    )}
                  </ul>
                </>
              ) : (
                <p className="text-gray-600 mb-4">
                  There are currently no available jobs. Please check back
                  later.
                </p>
              )}

              <Button
                variant="outline"
                onClick={resetFilters}
                disabled={!hasActiveFilters()}
              >
                Reset all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className={`bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all duration-500 ${
                      expandedCard === job._id
                        ? "shadow-2xl scale-[1.01]"
                        : "shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <div className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-6">
                        <div className="flex items-start space-x-6">
                          <div
                            className={`w-16 h-16 bg-gradient-to-r rounded-2xl flex items-center justify-center text-white text-xl font-bold`}
                          >
                            {job.company.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {job.title}
                            </h3>
                            <p className="text-purple-600 font-medium text-lg">
                              {job.company}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-gray-500 mt-2">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDate(job.createdAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{job.applicants} views</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <button
                            onClick={() => toggleSave(job._id)}
                            className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                          >
                            <Heart
                              className={`h-6 w-6 ${
                                savedJobs.has(job._id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-400"
                              } transition-colors`}
                            />
                          </button>

                          <button
                            onClick={() =>
                              setExpandedCard(
                                expandedCard === job._id ? null : job._id
                              )
                            }
                            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors"
                          >
                            {expandedCard === job._id ? (
                              <Minus className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                              {expandedCard === job._id ? "Less" : "More"}
                            </span>
                          </button>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {job.salary}
                            </div>
                            <div className="text-green-600 font-medium">
                              {job.matchScore}% match
                            </div>
                          </div>

                          <Link href={`/jobs/${job._id}`}>
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 font-medium flex items-center space-x-2">
                              <span>Apply</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <p className="text-gray-700 text-lg mb-6 line-clamp-1">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-3 mb-6">
                        {job.skills.slice(0, 5).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {expandedCard === job._id && (
                        <div className="border-t border-gray-200 pt-6 mt-6 animate-fadeIn">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            About this role
                          </h4>
                          <p className="text-gray-700 leading-relaxed mb-6">
                            {job.longDescription}
                          </p>

                          <div className="grid md:grid-cols-3 gap-6">
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">
                                Employment Type
                              </h5>
                              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                                {job.type.charAt(0).toUpperCase() +
                                  job.type.slice(1)}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">
                                Remote Work
                              </h5>
                              <span
                                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                  job.remote
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-50 text-gray-700"
                                }`}
                              >
                                {job.remote ? "Remote OK" : "On-site"}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">
                                Experience Level
                              </h5>
                              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                                {job.experience.charAt(0).toUpperCase() +
                                  job.experience.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={pagination.current === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.current - 1 &&
                        page <= pagination.current + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={
                            pagination.current === page ? "default" : "outline"
                          }
                          size="lg"
                          onClick={() => handlePageChange(page)}
                          className={
                            pagination.current === page
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                              : ""
                          }
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === pagination.current - 2 ||
                      page === pagination.current + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={pagination.current === pagination.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
