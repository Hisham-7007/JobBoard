"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Clock,
  Building,
  DollarSign,
  ArrowLeft,
  Loader2,
  Heart,
  Share2,
  BookmarkPlus,
  Star,
  ChevronRight,
  Calendar,
  Award,
  Target,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ApplicationModal } from "@/components/ApplicationModal";
import { Header } from "@/components/Header";

interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  experience: string;
  skills: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  createdAt: string;
  postedBy: {
    name: string;
  };
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.id}`
      );
      const data = await res.json();
      if (res.ok) {
        setJob(data);
        if (user && token) {
          await checkApplicationStatus(data._id);
        } else {
          setCheckingApplication(false);
        }
      } else {
        router.push("/jobs");
      }
    } catch (err) {
      console.error("Job fetch error:", err);
      router.push("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async (jobId: string) => {
    setCheckingApplication(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications/my-applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const applied = data.some((app: any) => app.job._id === jobId);
      setHasApplied(applied);
    } catch (error) {
      console.error("Check application error:", error);
    } finally {
      setCheckingApplication(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil(
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const formatSalary = (salary: any) => {
    if (!salary) return null;
    const { min, max, currency } = salary;
    if (min && max)
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${currency} ${min.toLocaleString()}+`;
    return null;
  };

  const getJobTypeColor = (type: string) => {
    const colors = {
      "full-time": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "part-time": "bg-blue-100 text-blue-800 border-blue-200",
      contract: "bg-purple-100 text-purple-800 border-purple-200",
      remote: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getExperienceLevel = (experience: string) => {
    const levels = {
      entry: { icon: "🌱", color: "text-green-600", bg: "bg-green-50" },
      mid: { icon: "🚀", color: "text-blue-600", bg: "bg-blue-50" },
      senior: { icon: "👑", color: "text-purple-600", bg: "bg-purple-50" },
    };
    return (
      levels[experience.toLowerCase() as keyof typeof levels] || {
        icon: "💼",
        color: "text-gray-600",
        bg: "bg-gray-50",
      }
    );
  };

  if (loading || (user && checkingApplication)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Job not found
          </h1>
          <p className="text-gray-600 mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/jobs">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const experienceData = getExperienceLevel(job.experience);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <Link
            href="/jobs"
            className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                    {job.title}
                  </h1>
                  <div className="flex items-center text-white/90 text-xl mb-4">
                    <Building className="h-6 w-6 mr-3" />
                    {job.company}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <BookmarkPlus
                      className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div
                  className={`px-4 py-2 rounded-full border font-medium ${getJobTypeColor(
                    job.type
                  )}`}
                >
                  {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                </div>
                <div
                  className={`px-4 py-2 rounded-full font-medium ${experienceData.bg} ${experienceData.color} border border-current/20`}
                >
                  <span className="mr-2">{experienceData.icon}</span>
                  {job.experience} Level
                </div>
                <div className="px-4 py-2 rounded-full bg-white/20 text-white border border-white/30 font-medium">
                  <MapPin className="h-4 w-4 mr-2 inline" />
                  {job.location}
                </div>
                <div className="px-4 py-2 rounded-full bg-white/20 text-white border border-white/30 font-medium">
                  <Clock className="h-4 w-4 mr-2 inline" />
                  {formatDate(job.createdAt)}
                </div>
              </div>

              {job.salary && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center text-white">
                    <DollarSign className="h-8 w-8 mr-3 p-1.5 bg-green-500 rounded-lg" />
                    <div>
                      <p className="text-sm text-white/80">Salary Range</p>
                      <p className="text-2xl font-bold">
                        {formatSalary(job.salary)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Apply Card in Hero */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Apply
              </h3>
              {!user ? (
                <>
                  <Alert className="mb-4 border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-800">
                      Sign in to apply for this position
                    </AlertDescription>
                  </Alert>
                  <Link href="/login" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Sign In to Apply
                    </Button>
                  </Link>
                </>
              ) : user.role === "admin" ? (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-800">
                    Admin accounts cannot apply for positions
                  </AlertDescription>
                </Alert>
              ) : checkingApplication ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : hasApplied ? (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800 flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-current" />
                    Application submitted successfully!
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-lg py-6"
                  onClick={() => setShowApplicationModal(true)}
                >
                  Apply Now
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3">Posted by</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {job.postedBy.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {job.postedBy.name}
                    </p>
                    <p className="text-sm text-gray-500">Hiring Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Job Description</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Requirements</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {job.requirements.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-start group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {idx + 1}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{req}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Required Skills</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-blue-800 font-medium hover:from-blue-100 hover:to-indigo-100 transition-colors cursor-default"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Stats */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Job Type</span>
                  <Badge className={getJobTypeColor(job.type)}>
                    {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-gray-900">
                    {job.experience} Level
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-gray-900">
                    {job.location}
                  </span>
                </div>
                {job.salary && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Salary</span>
                    <span className="font-medium text-gray-900">
                      {formatSalary(job.salary)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(job.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  About {job.company}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {job.company}
                      </p>
                      <p className="text-sm text-gray-600">Company</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {job.location}
                      </p>
                      <p className="text-sm text-gray-600">Location</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          jobId={job._id}
          jobTitle={job.title}
          company={job.company}
          onClose={() => setShowApplicationModal(false)}
          onSuccess={() => {
            setHasApplied(true);
            setShowApplicationModal(false);
          }}
        />
      )}
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   MapPin,
//   Clock,
//   Building,
//   Users,
//   DollarSign,
//   ArrowLeft,
//   Loader2,
// } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
// import { ApplicationModal } from "@/components/ApplicationModal";
// import { Header } from "@/components/Header";

// interface Job {
//   _id: string;
//   title: string;
//   company: string;
//   description: string;
//   requirements: string[];
//   location: string;
//   type: string;
//   experience: string;
//   skills: string[];
//   salary?: {
//     min: number;
//     max: number;
//     currency: string;
//   };
//   createdAt: string;
//   postedBy: {
//     name: string;
//   };
// }

// export default function JobDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { user, token, loading: authLoading } = useAuth();
//   const [job, setJob] = useState<Job | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showApplicationModal, setShowApplicationModal] = useState(false);
//   const [hasApplied, setHasApplied] = useState(false);
//   const [checkingApplication, setCheckingApplication] = useState(true);

//   useEffect(() => {
//     if (params.id) {
//       fetchJob();
//     }
//   }, [params.id]);

//   const fetchJob = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.id}`
//       );
//       const data = await res.json();
//       if (res.ok) {
//         setJob(data);
//         if (user && token) {
//           await checkApplicationStatus(data._id);
//         } else {
//           setCheckingApplication(false);
//         }
//       } else {
//         router.push("/jobs");
//       }
//     } catch (err) {
//       console.error("Job fetch error:", err);
//       router.push("/jobs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkApplicationStatus = async (jobId: string) => {
//     setCheckingApplication(true);
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/applications/my-applications`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const data = await res.json();
//       const applied = data.some((app: any) => app.job._id === jobId);
//       setHasApplied(applied);
//     } catch (error) {
//       console.error("Check application error:", error);
//     } finally {
//       setCheckingApplication(false);
//     }
//   };

//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     const now = new Date();
//     const diffDays = Math.ceil(
//       Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
//     );
//     if (diffDays === 1) return "1 day ago";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
//     return `${Math.ceil(diffDays / 30)} months ago`;
//   };

//   const formatSalary = (salary: any) => {
//     if (!salary) return null;
//     const { min, max, currency } = salary;
//     if (min && max)
//       return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
//     if (min) return `${currency} ${min.toLocaleString()}+`;
//     return null;
//   };

//   if (loading || (user && checkingApplication)) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             Job not found
//           </h1>
//           <Link href="/jobs">
//             <Button>Back to Jobs</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <Link
//           href="/jobs"
//           className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
//         </Link>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Job Card */}
//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
//                     <CardDescription className="text-lg text-blue-600 font-medium">
//                       {job.company}
//                     </CardDescription>
//                   </div>
//                   <Badge
//                     variant={job.type === "full-time" ? "default" : "secondary"}
//                     className="text-sm"
//                   >
//                     {job.type}
//                   </Badge>
//                 </div>
//                 <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
//                   <div className="flex items-center">
//                     <MapPin className="h-4 w-4 mr-1" />
//                     {job.location}
//                   </div>
//                   <div className="flex items-center">
//                     <Clock className="h-4 w-4 mr-1" />
//                     {formatDate(job.createdAt)}
//                   </div>
//                   <div className="flex items-center">
//                     <Users className="h-4 w-4 mr-1" />
//                     {job.experience} Level
//                   </div>
//                   {job.salary && (
//                     <div className="flex items-center">
//                       <DollarSign className="h-4 w-4 mr-1" />
//                       {formatSalary(job.salary)}
//                     </div>
//                   )}
//                 </div>
//               </CardHeader>

//               <CardContent className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-semibold mb-3">
//                     Job Description
//                   </h3>
//                   <p className="text-gray-700 whitespace-pre-line">
//                     {job.description}
//                   </p>
//                 </div>

//                 <Separator />

//                 {job.requirements?.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold mb-3">Requirements</h3>
//                     <ul className="space-y-2">
//                       {job.requirements.map((req, idx) => (
//                         <li key={idx} className="flex items-start">
//                           <span className="text-blue-600 mr-2">•</span>
//                           {req}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <Separator />

//                 {job.skills?.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold mb-3">
//                       Required Skills
//                     </h3>
//                     <div className="flex flex-wrap gap-2">
//                       {job.skills.map((skill, idx) => (
//                         <Badge key={idx} variant="secondary">
//                           {skill}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Apply Card */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Apply for this job</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {!user ? (
//                   <>
//                     <Alert>
//                       <AlertDescription>
//                         You need to sign in to apply.
//                       </AlertDescription>
//                     </Alert>
//                     <Link href="/login">
//                       <Button className="w-full mt-4">Sign In</Button>
//                     </Link>
//                   </>
//                 ) : user.role === "admin" ? (
//                   <Alert>
//                     <AlertDescription>Admins cannot apply.</AlertDescription>
//                   </Alert>
//                 ) : checkingApplication ? (
//                   <div className="flex justify-center py-4">
//                     <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
//                   </div>
//                 ) : hasApplied ? (
//                   <Alert>
//                     <AlertDescription>
//                       You have already applied.
//                     </AlertDescription>
//                   </Alert>
//                 ) : (
//                   <Button
//                     className="w-full"
//                     onClick={() => setShowApplicationModal(true)}
//                   >
//                     Apply Now
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Company Info + Job Details Cards */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>
//                   <Building className="mr-2 h-5 w-5" /> About {job.company}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-gray-700 space-y-2">
//                   <p>
//                     <strong>Posted by:</strong> {job.postedBy.name}
//                   </p>
//                   <p>
//                     <strong>Location:</strong> {job.location}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Job Details</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>
//                   <strong>Type:</strong> {job.type}
//                 </p>
//                 <p>
//                   <strong>Experience:</strong> {job.experience}
//                 </p>
//                 {job.salary && (
//                   <p>
//                     <strong>Salary:</strong> {formatSalary(job.salary)}
//                   </p>
//                 )}
//                 <p>
//                   <strong>Posted:</strong> {formatDate(job.createdAt)}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Application Modal */}
//       {showApplicationModal && (
//         <ApplicationModal
//           jobId={job._id}
//           jobTitle={job.title}
//           company={job.company}
//           onClose={() => setShowApplicationModal(false)}
//           onSuccess={() => {
//             setHasApplied(true);
//             setShowApplicationModal(false);
//           }}
//         />
//       )}
//     </div>
//   );
// }
