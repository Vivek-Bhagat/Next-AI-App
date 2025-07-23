import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if the username is already taken
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Find if there's an existing user by email
    const existingUserByEmail = await UserModel.findOne({ email });


    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.isVerified = true;
        await existingUserByEmail.save();
      }
    } else {
      // Create a new user if no user exists with the given email
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: true,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering User", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
