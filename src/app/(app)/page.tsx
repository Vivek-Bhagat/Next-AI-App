"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
        <span className="relative flex h-16 w-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-16 w-16 bg-blue-500"></span>
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Main content */}
      <main className="flex-grow min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 md:px-12 py-8 md:py-16 bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 text-white transition-all duration-700">
        <section className="text-center mb-4 md:mb-16 animate-fade-in-up w-full max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg mt-20 md:mt-24">
            Dive into the World of <span className="text-blue-400">Anonymous Feedback</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-2xl text-blue-100">
            True Feedback - Where your identity remains a secret.
          </p>
          <Link href="/sign-up">
            <Button className="mt-8 px-8 py-4 text-lg font-semibold rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg transition-transform transform hover:scale-105 animate-bounce-in">
              Get Started
            </Button>
          </Link>
        </section>

        {/* Feature Highlights */}
        <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 animate-fade-in px-2">
          <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-300 hover:bg-blue-400/20 group cursor-pointer animate-fade-in-up">
            <Mail className="w-8 h-8 mb-2 text-blue-300 group-hover:text-blue-500 transition-colors duration-300" />
            <h3 className="font-bold text-lg mb-1 group-hover:text-blue-200 transition-colors duration-300">100% Anonymous</h3>
            <p className="text-blue-100 text-sm group-hover:text-white transition-colors duration-300">Send and receive feedback without revealing your identity.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-300 hover:bg-blue-400/20 group cursor-pointer animate-fade-in-up delay-100">
            <span className="w-8 h-8 mb-2 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold group-hover:bg-blue-600 transition-colors duration-300">★</span>
            <h3 className="font-bold text-lg mb-1 group-hover:text-blue-200 transition-colors duration-300">Real-Time</h3>
            <p className="text-blue-100 text-sm group-hover:text-white transition-colors duration-300">Get instant notifications and updates on new feedback.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-300 hover:bg-blue-400/20 group cursor-pointer animate-fade-in-up delay-200">
            <span className="w-8 h-8 mb-2 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold group-hover:bg-blue-600 transition-colors duration-300">∞</span>
            <h3 className="font-bold text-lg mb-1 group-hover:text-blue-200 transition-colors duration-300">Unlimited</h3>
            <p className="text-blue-100 text-sm group-hover:text-white transition-colors duration-300">No limits on how much feedback you can send or receive.</p>
          </div>
        </section>

        {/* Animated Statistics */}
        <section className="w-full max-w-3xl flex flex-col sm:flex-row justify-center gap-8 mb-12 animate-fade-in px-2">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-blue-400 animate-pulse">12K+</span>
            <span className="text-blue-100">Users</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-blue-400 animate-pulse">100K+</span>
            <span className="text-blue-100">Messages</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-blue-400 animate-pulse">99%</span>
            <span className="text-blue-100">Satisfaction</span>
          </div>
        </section>

        {/* Carousel for Messages */}
        <section className="w-full max-w-2xl animate-fade-in-up px-2">
          <Carousel
            plugins={[Autoplay({ delay: 2500 })]}
            className="w-full animate-fade-in-up">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem
                  key={index}
                  className="p-4">
                  <Card className="bg-white/20 backdrop-blur-md border-none shadow-xl animate-fade-in hover:scale-105 transition-transform duration-300">
                    <CardHeader>
                      <CardTitle className="text-blue-200 group-hover:text-blue-400 transition-colors duration-300">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0 text-blue-300" />
                      <div>
                        <p className="text-white">{message.content}</p>
                        <p className="text-xs text-blue-100 mt-1">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Scroll to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-110 focus:outline-none animate-bounce-in md:hidden"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white animate-fade-in mt-8">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}
