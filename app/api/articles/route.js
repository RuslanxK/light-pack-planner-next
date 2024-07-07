import article from "../../../models/articleModel";
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";
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

    const { title, description } = await req.json();

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename
    });

    const signedUrl = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 60
    });

    const Article = new article({ title, description, imageKey: putObjectCommand.input.Key });
    await Article.save();

    return new NextResponse(JSON.stringify({ Article, signedUrl }), { status: 200 });
  } catch (error) {
   
    return new NextResponse(JSON.stringify({ message: "Failed to post article", error: error.message }), { status: 500 });
  }
};


  export const GET = async (req) => {

    try {
 
      await connectToDB();
      const Articles = await article.find()
      return new NextResponse(JSON.stringify(Articles), { status: 200 });
    } catch (error) {
      console.error("Error:", error);
      return new NextResponse("Failed to fetch articles", { status: 500 });
    }
  };
 
  

