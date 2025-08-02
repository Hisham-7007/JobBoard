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
  companyColor?: string;
}

interface Pagination {
  current: number;
  pages: number;
  total: number;
}

interface JobListingsProps {
  initialJobs?: Job[];
  showFilters?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  fetchJobs?: (params: any) => Promise<{ jobs: Job[]; pagination: Pagination }>;
  onJobClick?: (jobId: string) => void;
  showHeader?: boolean;
  showSaveButton?: boolean;
  basePath?: string;
}

export function JobListings({
  initialJobs = [],
  showFilters = true,
  showPagination = true,
  itemsPerPage = 9,
  fetchJobs,
  onJobClick,
  showHeader = true,
  showSaveButton = true,
  basePath = "/jobs",
}: JobListingsProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(initialJobs.length === 0);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pages: 1,
    total: initialJobs.length,
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
    if (fetchJobs) {
      const handler = setTimeout(() => {
        loadJobs();
      }, 500);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [pagination.current, filters]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: pagination.current,
        limit: itemsPerPage.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.type && filters.type !== "all" && { type: filters.type }),
        ...(filters.experience &&
          filters.experience !== "all" && { experience: filters.experience }),
      };

      const data = await fetchJobs!(queryParams);

      if (data) {
        setJobs(data.jobs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
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

  const handleJobClick = (jobId: string) => {
    if (onJobClick) {
      onJobClick(jobId);
    }
  };

  return (
    <div className="min-h-screen bg-white/40 backdrop-blur-sm">
      {showHeader && (
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
            Featured Opportunities
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Discover some of the latest job openings from top companies.
          </p>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm mb-6 md:mb-8 border border-gray-200/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
              onValueChange={(value) => handleFilterChange("experience", value)}
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
            <div className="mt-3 sm:mt-4 flex items-center">
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
      )}

      {/* Job Listings */}
      {loading ? (
        <div className="space-y-4 sm:space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 animate-pulse"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-xl sm:rounded-2xl"></div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 sm:w-32"></div>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
                  <div className="text-right">
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32 mb-1 sm:mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-12 sm:w-16"></div>
                  </div>
                  <div className="w-20 sm:w-24 h-8 sm:h-10 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50">
          <Briefcase className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
            No jobs found
          </h3>

          {hasActiveFilters() ? (
            <>
              <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
                No jobs matching these filters:
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 space-y-1">
                {filters.search && <li>Search: "{filters.search}"</li>}
                {filters.location && <li>Location: "{filters.location}"</li>}
                {filters.type !== "all" && (
                  <li>Type: {filters.type.replace("-", " ")}</li>
                )}
                {filters.experience !== "all" && (
                  <li>Experience: {filters.experience}</li>
                )}
              </ul>
            </>
          ) : (
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              There are currently no available jobs. Please check back later.
            </p>
          )}

          <Button
            variant="outline"
            onClick={resetFilters}
            disabled={!hasActiveFilters()}
            className="text-sm sm:text-base"
          >
            Reset all filters
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4 sm:space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className={`bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 ${
                  expandedCard === job._id
                    ? "shadow-xl sm:shadow-2xl scale-[1.01]"
                    : "shadow-lg hover:shadow-xl"
                }`}
              >
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-start space-x-4 sm:space-x-6">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${
                          job.companyColor || "from-purple-500 to-blue-500"
                        } rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-bold`}
                      >
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-purple-600 font-medium text-base sm:text-lg">
                          {job.company}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-500 mt-1 sm:mt-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">
                              {job.location}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">
                              {formatDate(job.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">
                              {job.applicants} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      {showSaveButton && (
                        <button
                          onClick={() => toggleSave(job._id)}
                          className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors"
                        >
                          <Heart
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${
                              savedJobs.has(job._id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            } transition-colors`}
                          />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          setExpandedCard(
                            expandedCard === job._id ? null : job._id
                          )
                        }
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors"
                      >
                        {expandedCard === job._id ? (
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                        <span className="text-sm sm:text-base font-medium">
                          {expandedCard === job._id ? "Less" : "More"}
                        </span>
                      </button>

                      <div className="text-right">
                        {job.salary && (
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                            {job.salary}
                          </div>
                        )}
                        {job.matchScore && (
                          <div className="text-green-600 font-medium text-sm sm:text-base">
                            {job.matchScore}% match
                          </div>
                        )}
                      </div>
                      {onJobClick ? (
                        <Button
                          onClick={() => handleJobClick(job._id)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 font-medium flex items-center space-x-1 sm:space-x-2"
                        >
                          <span>View</span>
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      ) : (
                        <Link href={`${basePath}/${job._id}`} passHref>
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 font-medium flex items-center space-x-1 sm:space-x-2">
                            <span>View</span>
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 text-base sm:text-lg mb-4 sm:mb-6 line-clamp-1">
                    {job.description}
                  </p>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                      {job.skills.slice(0, 5).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs sm:text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {expandedCard === job._id && (
                    <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-4 sm:mt-6 animate-fadeIn">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                        About this role
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
                        {job.longDescription || job.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                            Employment Type
                          </h5>
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium">
                            {job.type.charAt(0).toUpperCase() +
                              job.type.slice(1)}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                            Remote Work
                          </h5>
                          <span
                            className={`px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium ${
                              job.remote
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {job.remote ? "Remote OK" : "On-site"}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                            Experience Level
                          </h5>
                          <span className="bg-purple-50 text-purple-700 px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium">
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
          {showPagination && pagination.pages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-8 sm:mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="text-sm sm:text-base"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
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
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`text-sm sm:text-base ${
                        pagination.current === page
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : ""
                      }`}
                    >
                      {page}
                    </Button>
                  );
                } else if (
                  page === pagination.current - 2 ||
                  page === pagination.current + 2
                ) {
                  return (
                    <span
                      key={page}
                      className="px-2 text-gray-500 text-sm sm:text-base"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="text-sm sm:text-base"
              >
                Next
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
