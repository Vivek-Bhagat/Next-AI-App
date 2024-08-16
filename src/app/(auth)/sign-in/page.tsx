"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema.schemas"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

const page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernamemessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)
  const debouncedUsername = useDebounceValue(username, 300)
  const { toast } = useToast()
  const router = useRouter()

  // Implementation of zod
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  //
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true)
        setUsernamemessage("")

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debouncedUsername}`
          )
          setUsernamemessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernamemessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [debouncedUsername])

  return <div>page</div>
}

export default page
