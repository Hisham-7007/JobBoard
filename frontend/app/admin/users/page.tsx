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
  Users,
  Mail,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AdminHeader } from "@/components/AdminHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  createdAt: string;
}

interface Pagination {
  current: number;
  pages: number;
  total: number;
}

export default function AdminUsersPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pages: 1,
    total: 0,
  });
  const [filters] = useState({
    search: "",
    role: "all",
  });

  useEffect(() => {
    if (authLoading) return; // Wait until auth state is determined

    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    fetchUsers();
  }, [user, router, pagination.current, filters, authLoading]);

  const fetchUsers = async () => {
    setDataLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current.toString(),
        limit: "10",
        ...(filters.search && { search: filters.search }),
        ...(filters.role !== "all" && { role: filters.role }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "job_seeker":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
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
            User Management
          </h1>
          <p className="text-gray-600">
            Manage all registered users ({pagination.total} total)
          </p>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              All registered users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {users.map((userData) => (
                    <div
                      key={userData._id}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {userData.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Mail className="h-4 w-4 mr-2" />
                            {userData.email}
                          </div>
                        </div>
                        <Badge className={getRoleColor(userData.role)}>
                          {userData.role === "job_seeker"
                            ? "Job Seeker"
                            : "Admin"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                        {userData.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {userData.phone}
                          </div>
                        )}
                        {userData.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {userData.location}
                          </div>
                        )}
                        {userData.experience && (
                          <div className="flex items-center">
                            <Badge variant="secondary" className="text-xs">
                              {userData.experience} level
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Joined {formatDate(userData.createdAt)}
                        </div>
                      </div>

                      {userData.skills && userData.skills.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {userData.skills.slice(0, 5).map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {userData.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{userData.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
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
    </div>
  );
}
