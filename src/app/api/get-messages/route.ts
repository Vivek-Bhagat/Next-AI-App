import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { User } from "next-auth"
import mongoose from "mongoose"

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

  // aggregation pipeline
  const userId = new mongoose.Types.ObjectId(user._id)

  try {
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } }, // Corrected from id to _id
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ])

    if (!userMessages || userMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found in DB",
        },
        {
          status: 404, // Changed to 404
        }
      )
    }

    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.log("Error fetching messages", error)

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
