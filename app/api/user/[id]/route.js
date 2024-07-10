import user from '../../../../models/user';
import { connectToDB } from '../../../../utils/database';
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"



const s3 = new S3Client({

  region: process.env.S3_BUCKET_REGION,
  credentials: {

      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
})



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
    

  
    const requestBody = await req.text();
    const bodyData = JSON.parse(requestBody);


    Object.keys(bodyData).forEach(key => {
      User[key] = bodyData[key];
    });


    if(bodyData.profileImageKey) {

    const putObjectCommand = new PutObjectCommand({

      Bucket: process.env.S3_BUCKET_NAME,
      Key: bodyData.profileImageKey
  })


  const signedUrl = await getSignedUrl(s3, putObjectCommand, {

    expiresIn: 30
})

     await User.save();
     return new NextResponse(JSON.stringify({ message: 'User is updated successfully', signedUrl }), { status: 200 });
}


    await User.save();
    return new NextResponse(JSON.stringify({ message: 'User is updated successfully'}), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse('Failed to update User', { status: 500 });
  }
};