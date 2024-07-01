import item from "../../../../../models/item";
import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../utils/database";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"


const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")


const s3 = new S3Client({

    region: process.env.S3_BUCKET_REGION,
    credentials: {

        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
})



export const PUT = async (req, { params }) => {
  try {
    await connectToDB();


    const Item = await item.findOne({ _id: params.id, creator: params.creator });

    if (!Item) {
      return new NextResponse('Item not found', { status: 404 });
    }

    const existingKey = Item.productImageKey;

    const filename = existingKey || `${params.id}_${generateFileName()}`;


    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
    });

    const signedUrl = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 60,
    });

    Object.assign(Item, { productImageKey: putObjectCommand.input.Key });

    await Item.save();
    return new NextResponse(JSON.stringify({ signedUrl }), { status: 200 });
  } catch (err) {
    return new NextResponse('Failed to update item', { status: 500 });
  }
};




