import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { User } from "next-auth"
import mongoose from "mongoose"

export async function GET(request: Request) {
  // Establish database connection
  await dbConnect()

  // Retrieve session and user
  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  // Validate session and user
  if (!session || !user || typeof user._id !== "string") {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    )
  }

  // Convert user ID to ObjectId
  const userId = new mongoose.Types.ObjectId(user._id)

  try {
    // MongoDB aggregation to fetch messages
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } }, // Match the user by ID
      { $unwind: "$messages" }, // Unwind the messages array to flatten it
      { $sort: { "messages.createdAt": -1 } }, // Sort messages by creation date (descending)
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Group messages back into the user document
    ])

    // If no messages found for the user
    if (!userMessages || userMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages found for this user",
        },
        { status: 404 }
      )
    }

    // Return the found messages
    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching messages:", error)

    // Return internal server error in case of failure
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}
