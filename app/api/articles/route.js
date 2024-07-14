import article from "../../../models/articleModel";
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


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
    const title = formData.get('title')
    const description = formData.get('description')

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = Date.now().toString() + '-' + file.name;
   
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });


    await s3.send(putObjectCommand);

    const Article = new article({ title, description, imageKey: putObjectCommand.input.Key });

    await Article.save();

    return new NextResponse("Successfully uploaded", { status: 200 });
  } catch (error) {

    console.error()
    return new NextResponse(JSON.stringify({message: "Failed to post article", error: error.message,}), { status: 500 });
  }
};


export const GET = async (req) => {
  try {
    await connectToDB();
    const Articles = await article.find();
    return new NextResponse(JSON.stringify(Articles), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Failed to fetch articles", { status: 500 });
  }
};
