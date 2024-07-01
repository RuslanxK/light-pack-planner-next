import trip from "../../../../models/trip";
import { connectToDB } from "../../../../utils/database";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { userId, ...rest } = await req.json();
    const newTrip = await new trip({ ...rest, creator: userId }).save();
    return NextResponse.json(newTrip, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json("Failed to post trip", { status: 500 });
  }
};
