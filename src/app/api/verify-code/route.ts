import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { username, code } = await request.json()
    const decodedUsername = decodeURIComponent(username)

    // Find user by decoded username
    const user = await UserModel.findOne({ username: decodedUsername })

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404, // Changed to 404 for 'not found'
        }
      )
    }

    // Check if the verification code is valid and not expired
    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if (isCodeValid && isCodeNotExpired) {
      // If code is valid and not expired, verify the user
      user.isVerified = true
      await user.save()

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        {
          status: 200,
        }
      )
    } else if (!isCodeNotExpired) {
      // If the code has expired
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up to get a new code.",
        },
        {
          status: 400,
        }
      )
    } else {
      // If the code is incorrect
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        {
          status: 400,
        }
      )
    }
  } catch (error) {
    console.error("Error verifying User", error)

    // Return a more specific error response with a 500 status code
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    )
  }
}
