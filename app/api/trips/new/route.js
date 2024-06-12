import trip from "../../../../models/trip";
import { connectToDB } from "../../../../utils/database";
import { NextResponse } from "next/server";


export const POST = async (req) => {
    try {
      await connectToDB();

      const { userId, name, about, distance, startDate, endDate} = await req.json();
      const Trip = new trip({ name, about, distance, startDate, endDate, creator: userId});
      await Trip.save();
      return new NextResponse(JSON.stringify(Trip), { status: 200 });
    } catch (error) {
      
      console.error('Error:', error);
      return new NextResponse("Failed to post trip", { status: 500 });
    }
  };
  

  export const revalidate = 0;