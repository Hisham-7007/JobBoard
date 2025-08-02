"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ElegantLogo from "./ElegantLogo";

interface HeaderProps {
  title?: string;
  showBrowseJobs?: boolean;
}

export function Header({ showBrowseJobs = false }: HeaderProps) {
  const { user, logout, loading } = useAuth();

  if (loading) return null; // <--- أضف هذا السطر

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="flex items-center">
            <span className="ml-2 text-2xl font-bold text-gray-900">
              <ElegantLogo />
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {showBrowseJobs && (
              <Link href="/jobs">
                <Button variant="ghost">Browse Jobs</Button>
              </Link>
            )}

            {user ? (
              <>
                <span className="text-gray-700 hidden sm:inline">
                  Welcome, {user.name}
                </span>
                {user.role === "admin" ? (
                  <Link href="/admin">
                    <Button>Dashboard</Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button>Profile</Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
