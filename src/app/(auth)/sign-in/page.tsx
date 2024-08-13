'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernamemessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)
  

  return (
    <div>page</div>
  )
}

export default page