"use client";

import type React from "react";

import { PropsWithChildren, useState } from "react";

import { cn } from "@/core/lib/utils";
import { SideBar } from "@/app/dashboard/workspaces/components/side-bar";
import { Header } from "@/app/dashboard/workspaces/components/header";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} />
      {/* Main Content */}
      <main
        className={cn(
          "pt-16 transition-all duration-300 ease-in-out m-10",
          sidebarOpen ? "lg:pl-64" : "pl-0"
        )}
      >
        {children}
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
