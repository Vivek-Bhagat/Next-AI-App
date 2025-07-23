import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  // Input validation
  if (!username || !content) {
    return Response.json(
      {
        success: false,
        message: "Username and content are required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    // Create new message and push it to the user's messages
    user.messages.push({ content, createdAt: new Date() } as any);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200, // Changed to 200 for successful response
      }
    );
  } catch (error) {
    console.error("Unexpected error occurred:", error); // Improved logging

    return Response.json(
      {
        success: false,
        message: "Unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
