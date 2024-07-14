import user from "../../../models/user";
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import bcrypt from "bcrypt";

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
    const formData = await req.formData();
    const file = formData.getAll('image')[0]
    const { username, email, password, country, birthdate, gender, distance, weightOption, activityLevel, repeatedPassword } = Object.fromEntries(formData);

    const exists = await user.findOne({ email });
    if (exists) {
      return new NextResponse("Email Already exists", { status: 500 });
    }

    if (password !== repeatedPassword) {
      return new NextResponse("Passwords do not match", { status: 500 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = Date.now().toString() + '-' + file.name;

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type
    })

    await s3.send(putObjectCommand);

    const hashedPassword = await bcrypt.hash(password, 10);
    let admin = false
    if(email === process.env.NEXT_PUBLIC_ADMIN_1_EMAIL || email === process.env.NEXT_PUBLIC_ADMIN_2_EMAIL || email === process.env.NEXT_PUBLIC_ADMIN_3_EMAIL) {
      admin = true
    }

    const User = new user({ username, email, password: hashedPassword, profileImageKey: putObjectCommand.input.Key, isAdmin: admin, weightOption, distance, gender, birthdate, activityLevel, country});
    await User.save();
    return new NextResponse(JSON.stringify({User}), { status: 200 });
  } catch (error) {

    console.log(error)
    console.error()
    return new NextResponse("Failed to create user", { status: 500 });
  }
};

