"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ElegantLogo from "./ElegantLogo";

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="flex items-center">
            <ElegantLogo />
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/jobs">
              <Button variant="ghost">
                <Search className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>

            {user && (
              <>
                <span className="text-gray-700 hidden sm:inline">
                  Welcome, {user.name}
                </span>
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
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
