import user from '../../../../models/user';
import { connectToDB } from '../../../../utils/database';
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";



export const GET = async (req, {params}) => {
  

  try {
    await connectToDB();

    const foundUser = await user.findOne({ emailToken: params.id })
    
    if (!foundUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (foundUser.passwordResetTokenExpires && foundUser.passwordResetTokenExpires.toDateString() === yesterday.toDateString()) {
      foundUser.emailToken = null;
      await foundUser.save();
    }

    return new NextResponse(JSON.stringify(foundUser), {status: 200})

  } catch (error) {

    return new NextResponse('Failed to fetch user', { status: 500 });
  }
};



export const PUT = async (req, { params }) => {
  try {
    await connectToDB();

    const User = await user.findOne({ emailToken: params.id });

    if (!User) {
      return new NextResponse('User not found', { status: 404 });
    }

    const { verifiedCredentials, password, changingPassword, passwordResetTokenExpires, emailToken} = await req.json();

  
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    if (hashedPassword) {
      Object.assign(User, { verifiedCredentials, password: hashedPassword, changingPassword, passwordResetTokenExpires, emailToken });
    } else {
      Object.assign(User, { verifiedCredentials });
    }

    await User.save();
    return new NextResponse('User is Updated Successfully', { status: 200 });
  } catch (err) {
    console.error(err)
    return new NextResponse('Failed to update User', { status: 500 });
    
  }
};