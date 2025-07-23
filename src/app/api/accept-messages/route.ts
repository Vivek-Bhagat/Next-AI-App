import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { NextResponse } from "next/server"
import { User } from "next-auth"

// Utility function to handle authentication checks
async function authenticateUser() {
  await dbConnect()
  const session = await getServerSession(authOptions)
  const user: User | null = session?.user as User

  if (!session || !user || !user._id) {
    return null
  }

  return user
}

// Handling POST request to update user's acceptance of messages
export async function POST(request: Request) {
  const user = await authenticateUser()
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    )
  }

  const { isAcceptingMessages } = await request.json()

  // Validate the request body
  if (typeof isAcceptingMessages !== "boolean") {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request: isAcceptingMessages must be a boolean",
      },
      { status: 400 }
    )
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessages },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Failed to update user status" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Message acceptance updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to update user status:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

// Handling GET request to retrieve user's acceptance status for messages
export async function GET(request: Request) {
  const user = await authenticateUser()
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    )
  }

  try {
    const foundUser = await UserModel.findById(user._id)

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, isAcceptingMessages: foundUser.isAcceptingMessages },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error retrieving user acceptance status:", error)
    return NextResponse.json(
      { success: false, message: "Error retrieving user acceptance status" },
      { status: 500 }
    )
  }
}
