import bag from "../../../models/bag";
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";


export const POST = async (req, res) => {


  try {
    await connectToDB();

    const { userId, name, tripId, goal, description } = await req.json();

    const newBag = new bag({ creator: userId, name, tripId, goal, description });
    await newBag.save();

    return new NextResponse(JSON.stringify(newBag), { status: 200 });
  } catch (error) {
    console.error("Error creating new bag:", error);
    return new NextResponse("Failed to create a new bag", { status: 500 });
  }
};


export const revalidate = 0;