import item from "../../../../../models/item";
import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../utils/database";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
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

    const formData = await req.formData();
    const file = formData.get("image");

    const existingKey = Item.productImageKey;
    const key = existingKey || `${params.id}_${generateFileName()}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      
    });

    await s3.send(putObjectCommand);

    
    Object.assign(Item, { productImageKey: putObjectCommand.input.Key });

    await Item.save();

    return new NextResponse("saved successfully", { status: 200 });
  } catch (err) {
    return new NextResponse('Failed to update item', { status: 500 });
  }
};




