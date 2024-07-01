import { connectToDB } from "../../../../../utils/database"
import { NextResponse } from "next/server"
const {getLatestBagForAllTrips} = require("../../../../../BL/latestBag")
const {calculateTotalWeight} = require("../../../../../BL/totalBagKg")
import categories from "../../../../../models/categories"
import item from "../../../../../models/item"
import trip from '../../../../../models/trip'

export const GET = async (req, {params}) => {

   try {

     await connectToDB();
     const userId = params.id 
     const trips = await trip.find({creator: userId})
     const latestBag = await getLatestBagForAllTrips(userId);
     let latestBagData = null;
     if (latestBag) {
       const totalWeightResult = await calculateTotalWeight(latestBag._id);
       const totalCategories = await categories.countDocuments({ creator: userId, bagId: latestBag._id});
       const totalItems = await item.find({ creator: userId, bagId: latestBag._id });
       latestBagData = {
         latestBag: latestBag,
         latestBagTotalWeight: totalWeightResult ? totalWeightResult.totalWeight : null,
         totalCategories: totalCategories,
         totalItems: totalItems
       };
     }
     const tripsWidthLatestBag = {
       trips: trips,
       ...latestBagData
     };
     return new NextResponse(JSON.stringify(tripsWidthLatestBag), { status: 200 });
   } catch (error) {
     console.error("Error:", error);
     return new NextResponse("Failed to fetch trips", { status: 500 });
   }
 };

