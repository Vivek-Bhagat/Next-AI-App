import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { Message } from "@/model/User.model"


export async function POST(request: Request) {
  await dbConnect()

  const { username, content } = await request.json()

  try {
    const user = await UserModel.findOne({ username })
    if (!user) {
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

    // is user accepting the messages
    // can be known throught user fields

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        {
          status: 403,
        }
      )
      }
      
      
      //   user available
      //   now push the message to the user
      const newMessage = { content, createdAt: new Date() }
      user.messages.push(newMessage as Message) 
      await user.save()
      return Response.json(
        {
          success: true,
          message: "Message sent successfully",
        },
        {
          status: 401,
        }
      )
  } catch (error) {
      console.log("Unexpected error occured",error);
      
      return Response.json(
        {
          success: false,
          message: "Not Authenticate",
        },
        {
          status: 500,
        }
      )
  }
}
