"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "./ui/skeleton";
import useUserStore from "@/store/useSessionStore";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Free Beats", href: "/free-beats" },
  { name: "Free Samples", href: "/free-samples" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [isLoading, setIsLoading] = useState(true);
  const { session, setSession } = useUserStore();
  const pathname = usePathname();

  const getUser = useCallback(async () => {
    const supabase = createClient();
    try {
      const sessionData = await supabase.auth.getSession();
      if (!sessionData.error) {
        setSession(sessionData.data.session);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const isAdmin = session?.user?.user_metadata?.role === "admin";

  async function handleSignOut() {
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#39FF14]/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-industry-gothic text-2xl text-[#39FF14]">
            8KBEATZ
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-[#39FF14] ${
                pathname === item.href ? "text-[#39FF14]" : "text-gray-400"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {isLoading ? (
          <Skeleton className="h-12 w-12 rounded-full" />
        ) : (
          <div className="flex items-center space-x-4">
            {!session ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
                    asChild
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                </motion.div>
              </>
            ) : (
              <Button
                onClick={handleSignOut}
                className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
              >
                Sign out{" "}
              </Button>
            )}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserCircle className="h-5 w-5 text-[#39FF14]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/beats">Manage Beats</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/samples">Manage Samples</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/ads">Manage Ads</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/analytics">Analytics</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
