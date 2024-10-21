"use client"

import { MessageCard } from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/model/User.model"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import React, { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema.schemas"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { toast } = useToast()
  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  // Centralized function to handle API calls
  const fetchData = async (url: string, method: "GET" | "POST", data?: any) => {
    setIsLoading(method === "GET")
    setIsSwitchLoading(method === "POST")

    try {
      const response = await axios({ method, url, data })
      return response.data
    } catch (error) {
      handleError(error)
      throw error // Re-throw error for further handling if needed
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }

  const handleError = (error: unknown) => {
    const axiosError = error as AxiosError<ApiResponse>
    const errorMessage =
      axiosError.response?.data.message || "An unexpected error occurred"
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    })
  }

  const fetchAcceptMessages = useCallback(async () => {
    try {
      const data = await fetchData("/api/accept-message", "GET")
      setValue("acceptMessages", data.isAcceptingMessages) // Correcting key name to match the response
    } catch (error) {
      console.error("Error fetching acceptance status:", error)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    try {
      const data = await fetchData("/api/get-messages", "GET")
      setMessages(data.messages || [])
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages",
        })
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }, [])

  useEffect(() => {
    if (session?.user) {
      fetchMessages()
      fetchAcceptMessages()
    }
  }, [session, fetchMessages, fetchAcceptMessages])

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await fetchData("/api/accept-messages", "POST", {
        isAcceptingMessages: !acceptMessages, // Ensure this matches server expectations
      })
      setValue("acceptMessages", !acceptMessages)
      toast({
        title: response.message,
        variant: "default",
      })
    } catch (error) {
      console.error("Error toggling acceptance status:", error)
      
    } finally {
      setIsSwitchLoading(false) // Ensure loading state is reset
    }
  }

  if (!session?.user) {
    return <div>Please Log In</div>
  }

  const profileUrl = `${window.location.origin}/u/${
    (session.user as User).username
  }`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    })
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "ON" : "OFF"}
        </span>
      </div>

      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={() => fetchMessages(true)}
        disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default Page
