"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ElegantLogo from "./ElegantLogo";

interface AdminHeaderProps {
  title?: string;
  showViewSite?: boolean;
}

export function AdminHeader({ showViewSite = true }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/admin" className="flex items-center">
            <span className="ml-2 text-2xl font-bold text-gray-900">
              <ElegantLogo />
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {showViewSite && (
              <Link href="/jobs">
                <Button variant="ghost">View Site</Button>
              </Link>
            )}

            {user && (
              <>
                <span className="text-gray-700 hidden sm:inline">
                  Welcome, {user.name}
                </span>
                <Button variant="ghost" onClick={logout}>
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
