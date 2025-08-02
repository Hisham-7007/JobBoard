"use client";

import { useEffect, useState } from "react";
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
import { Briefcase, MapPin, Clock, Search } from "lucide-react";

interface Job {
  _id: string;
  title: string;
  type: string;
  location: string;
  salary: string;
  companyName: string;
  matchScore: number;
  applicants: number;
}

export default function JobCarousel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchQuery, jobs]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <Input
          placeholder="Search for jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cairo">Cairo</SelectItem>
            <SelectItem value="alex">Alexandria</SelectItem>
          </SelectContent>
        </Select>
        <Button className="w-full sm:w-auto" variant="secondary">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all bg-white flex flex-col justify-between"
          >
            {/* Job Info */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-purple-600">
                {job.title}
              </h3>
              <p className="text-gray-600">{job.companyName}</p>
              <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {job.type}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Posted 3d ago
                </span>
              </div>
            </div>

            {/* Bottom section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
              {/* Salary & Applicants */}
              <div>
                <div className="text-lg sm:text-xl font-bold text-gray-900">
                  {job.salary}
                </div>
                <div className="text-xs text-gray-500">
                  {job.applicants} applicants
                </div>
              </div>

              {/* Match Score & Apply */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="text-right sm:text-left">
                  <div className="text-xs text-gray-500">Match Score</div>
                  <div className="text-base font-bold text-green-600">
                    {job.matchScore}%
                  </div>
                </div>
                <Link href={`/jobs/${job._id}`} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-fit bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 font-medium">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
