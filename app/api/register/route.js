import user from "../../../models/user";
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"


const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

const filename = generateFileName();


const s3 = new S3Client({

    region: process.env.S3_BUCKET_REGION,
    credentials: {

        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
})


export const POST = async (req) => {

  try {
    await connectToDB();
    
    
    const { username, email, password, repeatedPassword, weightOption, distance, gender, age, activityLevel, country} = await req.json();


    const putObjectCommand = new PutObjectCommand({

        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename
    })


    const signedUrl = await getSignedUrl(s3, putObjectCommand, {

        expiresIn: 60
    })


    
    const exists = await user.findOne({ email });

    if (exists) {
      return new NextResponse("Email Already exists", { status: 500 });
    }

    if (password !== repeatedPassword) {
      return new NextResponse("Passwords do not match", { status: 500 });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    let admin = false

    if(email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
       
        admin = true
    }

    const User = new user({ username, email, password: hashedPassword, profileImageKey: putObjectCommand.input.Key, isAdmin: admin, weightOption, distance, gender, age, activityLevel, country});
    await User.save();
    return new NextResponse(JSON.stringify({User, signedUrl}), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to create user", { status: 500 });
  }
};

export const revalidate = 0;
