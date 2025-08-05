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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Phone,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AdminHeader } from "@/components/AdminHeader";
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
  applicant: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    skills?: string[];
    experience?: string;
  };
  status: string;
  resume: string;
  coverLetter: string;
  notes?: string;
  createdAt: string;
}

interface Pagination {
  current: number;
  pages: number;
  total: number;
}

export default function AdminApplicationsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    jobId: "",
  });
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "pending",
    notes: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchApplications();
    }
  }, [user, pagination.current, filters]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current.toString(),
        limit: "10",
      });

      // Only add search filter if it's not empty
      if (filters.search.trim()) {
        queryParams.append("search", filters.search.trim());
      }

      // Only add status filter if it's not "all"
      if (filters.status && filters.status !== "all") {
        queryParams.append("status", filters.status);
      }

      // Only add jobId filter if it's not empty
      if (filters.jobId.trim()) {
        queryParams.append("jobId", filters.jobId.trim());
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
        setPagination(data.pagination);
      } else {
        throw new Error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setStatusUpdate({
      status: application.status,
      notes: application.notes || "",
    });
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication) return;

    setUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${selectedApplication._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(statusUpdate),
        }
      );

      if (response.ok) {
        const updatedApplication = await response.json();
        setApplications((prev) =>
          prev.map((app) =>
            app._id === selectedApplication._id ? updatedApplication : app
          )
        );
        setSelectedApplication(null);
        toast({
          title: "Success",
          description: "Application status updated successfully",
        });
        // Refresh applications after update
        fetchApplications();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // Already handled by useEffect redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/admin"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Application Management
          </h1>
          <p className="text-gray-600">
            Review and manage job applications ({pagination.total} total)
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Showing {applications.length} of {pagination.total} applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications found
                </h3>
                <p className="text-gray-600">
                  {filters.search || filters.status !== "all" || filters.jobId
                    ? "Try adjusting your filters"
                    : "No applications have been submitted yet"}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application._id}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {application.applicant.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.applicant.email}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">
                            Applied for: {application.job.title} at{" "}
                            {application.job.company}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewApplication(application)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 space-x-4 mb-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(application.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {application.job.location}
                        </div>
                        <Badge variant="secondary">
                          {application.job.type}
                        </Badge>
                      </div>

                      {application.applicant.skills &&
                        application.applicant.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {application.applicant.skills
                              .slice(0, 5)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {application.applicant.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{application.applicant.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
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
                              pagination.current === page
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === pagination.current - 2 ||
                        page === pagination.current + 2
                      ) {
                        return (
                          <span key={page} className="px-2">
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
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <Dialog open={true} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review application from {selectedApplication.applicant.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Applicant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Name
                      </Label>
                      <p className="text-gray-900">
                        {selectedApplication.applicant.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Email
                      </Label>
                      <p className="text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {selectedApplication.applicant.email}
                      </p>
                    </div>
                    {selectedApplication.applicant.phone && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Phone
                        </Label>
                        <p className="text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {selectedApplication.applicant.phone}
                        </p>
                      </div>
                    )}
                    {selectedApplication.applicant.location && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Location
                        </Label>
                        <p className="text-gray-900 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {selectedApplication.applicant.location}
                        </p>
                      </div>
                    )}
                    {selectedApplication.applicant.experience && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Experience Level
                        </Label>
                        <p className="text-gray-900 capitalize">
                          {selectedApplication.applicant.experience}
                        </p>
                      </div>
                    )}
                    {selectedApplication.applicant.skills &&
                      selectedApplication.applicant.skills.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Skills
                          </Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedApplication.applicant.skills.map(
                              (skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Job Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Position
                      </Label>
                      <p className="text-gray-900">
                        {selectedApplication.job.title}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Company
                      </Label>
                      <p className="text-gray-900">
                        {selectedApplication.job.company}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Location
                      </Label>
                      <p className="text-gray-900">
                        {selectedApplication.job.location}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Type
                      </Label>
                      <Badge variant="secondary">
                        {selectedApplication.job.type}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Applied On
                      </Label>
                      <p className="text-gray-900">
                        {formatDate(selectedApplication.createdAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resume */}
              <Card>
                <CardHeader>
                  <CardTitle>Resume/CV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap text-sm">
                      {selectedApplication.resume}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap text-sm">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Status Update */}
              <Card>
                <CardHeader>
                  <CardTitle>Update Application Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={statusUpdate.status}
                        onValueChange={(value) =>
                          setStatusUpdate((prev) => ({
                            ...prev,
                            status: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="shortlisted">
                            Shortlisted
                          </SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Current Status</Label>
                      <Badge
                        className={getStatusColor(selectedApplication.status)}
                      >
                        {selectedApplication.status.charAt(0).toUpperCase() +
                          selectedApplication.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={statusUpdate.notes}
                      onChange={(e) =>
                        setStatusUpdate((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Add any notes about this application..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedApplication(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateStatus} disabled={updating}>
                      {updating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Status"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
