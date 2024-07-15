import trip from "../../../../../models/trip";
import bag from "../../../../../models/bag";
import category from "../../../../../models/categories";
import item from "../../../../../models/item";
import { connectToDB } from "../../../../../utils/database";
import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";



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

    const foundTrip = await trip.findOne({ _id: params.id, creator: params.creator });
    const bagsOfTheTrip = await bag.find({ tripId: params.id, creator: params.creator });

    if (!foundTrip) {
      return new NextResponse("Trip not found", { status: 404 });
    }

    const tripWithBags = {
      trip: foundTrip,
      bags: bagsOfTheTrip,
    };

    return new NextResponse(JSON.stringify(tripWithBags), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch trip", { status: 500 });
  }
};



export const PUT = async (req, { params }) => {

  try {
    await connectToDB();

    const Trip = await trip.findOne({ _id: params.id, creator: params.creator});

    if (!Trip) {
      return new NextResponse("Trip not found", { status: 404 });
    }

    const { name, about, distance, startDate, endDate } = await req.json();

    Object.assign(Trip, { name, about, distance, startDate, endDate });

    await Trip.save();
    return new NextResponse("Trip is Updated Successfully", { status: 200 });
  } catch (err) {
    return new NextResponse("Failed to update trip", { status: 500 });
  }
};



export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    
    const itemsOfTheTrip = await item.find({ tripId: params.id, creator: params.creator });

    const deletePromises = itemsOfTheTrip.map((item) => {
      if (item.productImageKey) {
        const deleteObjectCommand = new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: item.productImageKey,
        });

        return s3.send(deleteObjectCommand);
      }
      return Promise.resolve();
    });

    await Promise.all(deletePromises);

    await trip.findByIdAndDelete({ _id: params.id, creator: params.creator});
    await bag.deleteMany({ tripId: params.id, creator: params.creator});
    await category.deleteMany({ tripId: params.id, creator: params.creator });
    await item.deleteMany({ tripId: params.id, creator: params.creator});
    return new NextResponse("Trip is Deleted Successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to delete trip", { status: 500 });
  }
};

