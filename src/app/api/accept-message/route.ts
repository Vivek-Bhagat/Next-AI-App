import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { User } from "next-auth"

// Handling POST request to update user's acceptance of messages
export async function POST(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    )
  }

  const userId = user._id

  // Validate the request body
  const { isAcceptingMessages } = await request.json()
  if (typeof isAcceptingMessages !== "boolean") {
    return Response.json(
      {
        success: false,
        message: "Invalid request: isAcceptingMessages must be a boolean",
      },
      {
        status: 400,
      }
    )
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages },
      { new: true }
    )

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        {
          status: 500,
        }
      )
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance updated successfully",
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error("Failed to update user status:", error)

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    )
  }
}

// Handling GET request to retrieve user's acceptance status for messages
export async function GET(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    )
  }

  const userId = user._id

  try {
    const foundUser = await UserModel.findById(userId)

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      )
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error retrieving user acceptance status:", error)

    return Response.json(
      {
        success: false,
        message: "Error retrieving user acceptance status",
      },
      {
        status: 500,
      }
    )
  }
}
