import user from '../../../../models/user';
import { connectToDB } from '../../../../utils/database';
import { NextResponse } from "next/server";



export const GET = async (req, {params}) => {
  

  try {
    await connectToDB();

    const foundUser = await user.findOne({ _id: params.id })
    
    if (!foundUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    return new NextResponse(JSON.stringify(foundUser), {status: 200})

  } catch (error) {

    return new NextResponse('Failed to fetch user', { status: 500 });
  }
};



export const PUT = async (req, { params }) => {
  try {
    await connectToDB();

    const User = await user.findOne({ _id: params.id });

    if (!User) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Get the entire request body
    const requestBody = await req.text();
    const bodyData = JSON.parse(requestBody);

    // Update User fields using the data from the request body
    Object.keys(bodyData).forEach(key => {
      User[key] = bodyData[key];
    });

    await User.save();
    return new NextResponse('User is Updated Successfully', { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse('Failed to update User', { status: 500 });
  }
};