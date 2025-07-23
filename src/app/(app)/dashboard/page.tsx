"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema.schemas";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  // Centralized function to handle API calls
  const fetchData = async (url: string, method: "GET" | "POST", data?: any) => {
    setIsLoading(method === "GET");
    setIsSwitchLoading(method === "POST");

    try {
      const response = await axios({ method, url, data });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error; // Re-throw error for further handling if needed
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    const axiosError = error as AxiosError<ApiResponse>;
    const errorMessage =
      axiosError.response?.data.message || "An unexpected error occurred";
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const fetchAcceptMessages = useCallback(async () => {
    try {
      const data = await fetchData("/api/accept-message", "GET");
      setValue("acceptMessages", data.isAcceptingMessages); // Correcting key name to match the response
    } catch (error) {
      console.error("Error fetching acceptance status:", error);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    try {
      const data = await fetchData("/api/get-messages", "GET");
      setMessages(data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetchAcceptMessages();
    }
  }, [session, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await fetchData("/api/accept-messages", "POST", {
        isAcceptingMessages: !acceptMessages, // Ensure this matches server expectations
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.message,
        variant: "default",
      });
    } catch (error) {
      console.error("Error toggling acceptance status:", error);
    } finally {
      setIsSwitchLoading(false); // Ensure loading state is reset
    }
  };

  if (!session?.user) {
    return <div>Please Log In</div>;
  }

  const profileUrl = `${window.location.origin}/u/${
    (session.user as User).username
  }`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 py-12 px-2 animate-fade-in">
      <div className="relative w-full max-w-5xl p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 mt-8">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full blur-2xl opacity-60 animate-pulse"></div>
        <h1 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg text-center tracking-tight">
          Dashboard
        </h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-blue-100">
              Your Unique Link
            </h2>
            <div className="flex items-center bg-white/20 rounded-lg p-2">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="bg-transparent w-full p-2 text-white focus:outline-none"
              />
              <Button
                onClick={copyToClipboard}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform hover:scale-105">
                Copy
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/20 rounded-lg p-3">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="text-blue-100 font-medium">
              Accept Messages:{" "}
              <span
                className={acceptMessages ? "text-green-400" : "text-red-400"}>
                {acceptMessages ? "ON" : "OFF"}
              </span>
            </span>
          </div>
        </div>
        <Separator className="mb-8" />
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Messages</h2>
          <Button
            variant="outline"
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            className="flex items-center gap-2 border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={() =>
                  setMessages(messages.filter((m) => m._id !== message._id))
                }
              />
            ))
          ) : (
            <p className="text-blue-100 col-span-full text-center">
              No messages to display.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
