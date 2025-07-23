"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg animate-fade-in">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 group">
          <span className="inline-block w-8 h-8 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full shadow-lg animate-pulse"></span>
          <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg group-hover:text-blue-400 transition-colors duration-300">
            True Feedback
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="relative group hidden md:inline-block">
            <span className="text-white font-medium transition-colors duration-300 group-hover:text-blue-400">
              Home
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {session ? (
            <>
              <span className="hidden md:inline-block text-blue-100 font-medium mr-2 animate-fade-in-up">
                Welcome, {user?.username || user?.email}
              </span>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 animate-bounce-in">
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 animate-bounce-in">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
