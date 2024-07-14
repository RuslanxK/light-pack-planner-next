import user from "../../../../models/user";
import { connectToDB } from "../../../../utils/database";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const foundUser = await user.findOne({ _id: params.id });

    if (!foundUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(foundUser), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch user", { status: 500 });
  }
};



export const PUT = async (req, { params }) => {
  try {
    await connectToDB();

    const User = await user.findOne({ _id: params.id });

    if (!User) {
      return new NextResponse("User not found", { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("image");

    const userData = Object.fromEntries(formData);
    delete userData.image;

    Object.keys(userData).forEach((key) => {
      User[key] = userData[key];
    });

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = Date.now().toString() + '-' + file.name;

      const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      });

      await s3.send(putObjectCommand);

      if (User.profileImageKey) {
        const deleteObjectCommand = new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: User.profileImageKey,
        });
        await s3.send(deleteObjectCommand);
      }

      
      User.profileImageKey = key;
    }

    await User.save();
    return new NextResponse(
      JSON.stringify({ message: "User is updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse("Failed to update user", { status: 500 });
  }
};

export const revalidate = 0;