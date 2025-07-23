import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema.schemas"

// Define the Zod schema for validating query parameters
const UsernameQuerySchema = z.object({
  username: usernameValidation,
})

// Utility function for sending JSON responses
function sendJsonResponse(success: boolean, message: string, status: number) {
  return Response.json({ success, message }, { status })
}

export async function GET(request: Request) {
  await dbConnect()

  try {
    const { searchParams } = new URL(request.url)
    const queryParams = {
      username: searchParams.get("username"),
    }

    // Validate query parameters using zod
    const result = UsernameQuerySchema.safeParse(queryParams)

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []
      return sendJsonResponse(
        false,
        usernameErrors.length > 0
          ? usernameErrors.join(", ")
          : "Invalid query parameters",
        400
      )
    }

    const { username } = result.data

    // Check if the username already exists in the database and is verified
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    })

    if (existingVerifiedUser) {
      return sendJsonResponse(
        false,
        "Username is already taken",
        409 // Conflict
      )
    }

    // If the username is available
    return sendJsonResponse(true, "Username is unique", 200)
  } catch (error) {
    console.error("Error checking username:", error)
    return sendJsonResponse(false, "Error checking username", 500)
  }
}
