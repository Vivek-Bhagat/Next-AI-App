import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow DELETE requests
  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    })
  }

  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid message ID",
    })
  }

  try {
    await dbConnect()

    // Find user by ID and remove the message
    const user = await UserModel.findOneAndUpdate(
      { "messages._id": id },
      { $pull: { messages: { _id: id } } },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting message:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
