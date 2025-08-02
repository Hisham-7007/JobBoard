"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  MapPin,
  Clock,
  User,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Target,
  Award,
  Star,
  Filter,
  Search,
  Bell,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/DashboardHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
  };
  status: string;
  createdAt: string;
  resume: string;
  coverLetter: string;
}

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "admin") {
      router.push("/admin");
      return;
    }

    fetchApplications();
  }, [user, router, authLoading]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications/my-applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200";
      case "reviewed":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200";
      case "shortlisted":
        return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200";
      case "hired":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "reviewed":
        return <Eye className="h-3 w-3" />;
      case "shortlisted":
        return <Star className="h-3 w-3" />;
      case "rejected":
        return <XCircle className="h-3 w-3" />;
      case "hired":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    reviewed: applications.filter((app) =>
      ["reviewed", "shortlisted"].includes(app.status)
    ).length,
    hired: applications.filter((app) => app.status === "hired").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
    successRate:
      applications.length > 0
        ? Math.round(
            (applications.filter((app) => app.status === "hired").length /
              applications.length) *
              100
          )
        : 0,
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Welcome Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white opacity-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back {user.name}
                </h1>
                <p className="text-xl opacity-90">
                  Ready to take your career to the next level?
                </p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-6 py-3 backdrop-blur-sm">
                  <Bell className="h-5 w-5" />
                  <span>3 new updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="applications" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12 bg-white shadow-lg rounded-full border-0">
            <TabsTrigger
              value="applications"
              className="rounded-full font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              My Applications
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-full font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Applications
                    </CardTitle>
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.total}
                  </div>
                  <p className="text-xs text-gray-500">
                    Applications submitted
                  </p>
                </CardContent>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-amber-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Pending
                    </CardTitle>
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.pending}
                  </div>
                  <p className="text-xs text-gray-500">Awaiting response</p>
                </CardContent>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Under Review
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.reviewed}
                  </div>
                  <p className="text-xs text-gray-500">In progress</p>
                </CardContent>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Success Rate
                    </CardTitle>
                    <Award className="h-5 w-5 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stats.successRate}%
                  </div>
                  <p className="text-xs text-gray-500">Hire success rate</p>
                </CardContent>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
              </Card>
            </div>

            {/* Search and Filter Section */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none bg-white min-w-[160px]"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                <CardTitle className="flex items-center text-xl">
                  <Briefcase className="h-6 w-6 mr-3 text-indigo-600" />
                  Your Applications
                </CardTitle>
                <CardDescription>
                  Track and manage your job application journey
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-gray-50 rounded-xl p-6"
                      >
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <Briefcase className="h-12 w-12 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchTerm || filterStatus !== "all"
                        ? "No matching applications"
                        : "No applications yet"}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {searchTerm || filterStatus !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Start your job search journey by applying to positions that match your skills"}
                    </p>
                    {!searchTerm && filterStatus === "all" && (
                      <Link href="/jobs">
                        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          Explore Opportunities
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((application, index) => (
                      <div
                        key={application._id}
                        className="group relative bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "fadeInUp 0.6s ease-out forwards",
                        }}
                      >
                        <div className="absolute top-4 right-4">
                          <Badge
                            className={`${getStatusColor(
                              application.status
                            )} px-3 py-1 rounded-full font-medium border flex items-center gap-1`}
                          >
                            {getStatusIcon(application.status)}
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="pr-32">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                            <Link
                              href={`/jobs/${application.job._id}`}
                              className="hover:underline"
                            >
                              {application.job.title}
                            </Link>
                          </h3>
                          <p className="text-lg font-medium text-indigo-600 mb-3">
                            {application.job.company}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                            {application.job.location}
                          </div>
                          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            Applied {formatDate(application.createdAt)}
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                          >
                            {application.job.type}
                          </Badge>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                            {application.coverLetter}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            <Card className="border-0 shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <User className="h-6 w-6 mr-3" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Your professional details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Full Name
                      </label>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {user.name}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Email Address
                      </label>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {user.email}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Account Type
                      </label>
                      <p className="text-lg font-medium text-gray-900 mt-1 capitalize">
                        {user.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {user.phone && (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Phone Number
                        </label>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                          {user.phone}
                        </p>
                      </div>
                    )}
                    {user.location && (
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Location
                        </label>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                          {user.location}
                        </p>
                      </div>
                    )}
                    {user.experience && (
                      <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-4">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Experience Level
                        </label>
                        <p className="text-lg font-medium text-gray-900 mt-1 capitalize">
                          {user.experience}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {user.skills && user.skills.length > 0 && (
                  <div className="mt-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6">
                    <label className="text-lg font-semibold text-gray-800 mb-4 block">
                      Skills & Expertise
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {user.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200 px-4 py-2 text-sm font-medium hover:from-indigo-200 hover:to-purple-200 transition-all duration-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
