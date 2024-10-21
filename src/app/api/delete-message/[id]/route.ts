import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid message ID",
      },
      { status: 400 }
    )
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
      return NextResponse.json(
        {
          success: false,
          message: "Message not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}
