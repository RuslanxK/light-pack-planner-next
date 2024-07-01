import bag from '../../../models/bag';
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";
import category from '../../../models/categories';
import item from '../../../models/item';
import trip from '../../../models/trip'; // Import the trip model
import user from '../../../models/user'; // Import the user model

const { calculateTotalWeight } = require("../../../BL/totalBagKg");
const { calculateWornItemsTotalWeight } = require("../../../BL/totalWorn");

export const GET = async (req) => {
  try {
    await connectToDB();

    // Fetch bags with user details
    const bagsWithUserNames = await bag.find({ exploreBags: true }).lean();

    // Fetch all trip details
    const allTrips = await trip.find({}).lean();
    const tripMap = new Map(allTrips.map(trip => [trip._id.toString(), trip.name]));

    // Fetch all user details
    const userIds = bagsWithUserNames.map(bag => bag.creator);
    const users = await user.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map(user => [user._id.toString(), { username: user.username, weightOption: user.weightOption }]));

    // Fetch additional details and combine results
    const bagsWithTotals = await Promise.all(bagsWithUserNames.map(async (bag) => {
      const totalWorn = await calculateWornItemsTotalWeight(bag._id);
      const totalWeightResult = await calculateTotalWeight(bag._id);

      const categoriesOfTheBag = await category.countDocuments({ bagId: bag._id, creator: bag.creator });
      const itemsOfTheBag = await item.countDocuments({ bagId: bag._id, creator: bag.creator });

      // Find the trip name for the current bag
      const tripName = tripMap.get(bag.tripId?.toString()) || null;

      // Find the user details for the current bag
      const userDetails = userMap.get(bag.creator.toString()) || {};

      return {
        ...bag,
        totalBagWeight: totalWeightResult.totalWeight,
        totalWorn: totalWorn.totalWeight,
        totalCategories: categoriesOfTheBag,
        totalItems: itemsOfTheBag,
        tripName, // Include the trip name
        userDetails // Include user details
      };
    }));

    return new NextResponse(JSON.stringify(bagsWithTotals), { status: 200 });
  } catch (error) {
    console.error(error); // Debugging log to see the error message
    return new NextResponse("Failed to fetch bags", { status: 500 });
  }
}


export const revalidate = 0