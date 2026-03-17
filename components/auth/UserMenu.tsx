"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginModal } from "@/components/auth/LoginModal";
import Cookies from "js-cookie";

interface UserData {
  id: string;
  phone: string;
  country: string;
  referralCode: string;
  walletBalance: number;
}

export function UserMenu() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        // Not authenticated
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // Check for ?login=true query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "true") {
      setLoginOpen(true);
    }
  }, []);

  function handleSignOut() {
    Cookies.remove("token");
    window.location.href = "/";
  }

  if (loading) return null;

  if (!user) {
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => setLoginOpen(true)}>
          Sign In
        </Button>
        <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      </>
    );
  }

  const initials = user.phone.slice(-2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials}
          </span>
          <span className="hidden sm:inline">{user.phone}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href="/wallet">Wallet</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/referral">Referral</a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
