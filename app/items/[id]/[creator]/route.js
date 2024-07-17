import item from "../../../../models/item";
import { NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/database";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"


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

    const updateData = await req.json();
    Object.keys(updateData).forEach(key => {
      Item[key] = updateData[key];
    });

    await Item.save();
    return new NextResponse(JSON.stringify(Item), { status: 200 });
  } catch (err) {
    return new NextResponse('Failed to update item', { status: 500 });
  }
};





export const DELETE = async (req, {params}) => {

    try {

    await connectToDB();
    const Item = await item.findOne({ _id: params.id, creator: params.creator });
    if (!Item) {
      return new NextResponse("Item not found", { status: 404 });
    }

    if (Item.productImageKey) {
    
        const deleteObjectCommand = new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: Item.productImageKey,
        });

    await s3.send(deleteObjectCommand)

    }

    await item.findByIdAndDelete({ _id: params.id, creator: params.creator});


    return new NextResponse("Item is Deleted Successfully", {
      status: 200,
    });
  } 
  
  catch (error) {
    console.error(error)
    return new NextResponse("Failed to delete category", { status: 500 });
    
  }
};


