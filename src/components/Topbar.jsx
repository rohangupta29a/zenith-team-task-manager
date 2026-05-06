"use client";

import React from "react";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-slate-900/40 backdrop-blur-md px-6 z-10 relative">
      <div className="flex flex-1 items-center gap-4">
        {/* Placeholder for search or breadcrumbs */}
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-slate-100">
                {user.name}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === "admin" ? "primary" : "default"} className="text-[10px] px-1.5 py-0">
                  {user.role}
                </Badge>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="h-6 w-px bg-white/10 mx-2" />
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-rose-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
