import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { User } from "next-auth"


// by checking the session we gonna check if the user is accepting the message or not

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
  const acceptMessages = await request.json()

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    )

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages ",
        },
        {
          status: 500,
        }
      )
    }
    //   true part is user is found
    return Response.json(
      {
        success: true,
        message: "message acceptances updated successfully",
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.log("Failed to update user status to accept messages ")

    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages ",
      },
      {
        status: 500,
      }
    )
  }
}

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
  const foundUser = await UserModel.findById(userId)

  try {
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
        //  message: "Not Authenticated",
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.log("Failed to update user status to accept messages ")

    return Response.json(
      {
        success: false,
        message: "Error in getting user acceptance message",
      },
      {
        status: 500,
      }
    )
  }
}
