import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import { tree } from "next/dist/build/templates/app-page"

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { username, email, password } = await request.json()

    //  Find the user by the username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    })
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      )
    }

    //  find the user by the email
    const existingUserByEmail = await UserModel.findOne({ email })

    //   generating the code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        )
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

        await existingUserByEmail.save()
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)

      const expirydate = new Date()

      expirydate.setHours(expirydate.getHours() + 1)

      // creating a new user since there is user already exists
      const newuser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expirydate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      })
      await newuser.save()
    }

    //   send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    )

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      )
    }

    return Response.json(
      {
        success: true,
        message: "User Registered successfuly. Please verify your Email",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error registering User", error)
    return Response.json(
      {
        success: false,
        message: "Error regitering user",
      },
      {
        status: 500,
      }
    )
  }
}
