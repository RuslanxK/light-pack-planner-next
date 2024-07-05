// pages/api/checkEmail.js
import { connectToDB } from '../../../utils/database';
import { NextResponse } from 'next/server';
import User from '../../../models/user'; // Ensure you have the correct model import

export const POST = async (req) => {
  try {
    await connectToDB();

    const { email } = await req.json();
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      return NextResponse.json({ message: "Email is already in use." }, { status: 400 });
    }

    return NextResponse.json({ message: "Email is available." }, { status: 200 });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
};
