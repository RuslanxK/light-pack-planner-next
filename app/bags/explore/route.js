import bag from '../../../models/bag';
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";
import category from '../../../models/categories';
import item from '../../../models/item';

const { calculateTotalWeight } = require("../../../BL/totalBagKg");
const { calculateCategoryTotalWeight } = require("../../../BL/totalCategoryKg");
const { calculateWornItemsTotalWeight } = require("../../../BL/totalWorn");

export const GET = async (req) => {
  try {
    await connectToDB();

    const bagsWithUserNames = await bag.aggregate([
      { $match: { exploreBags: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          creator: 1,
          exploreBags: 1,
          goal: 1,
          passed: 1,
          likes: 1,
          'userDetails.username': 1,
          'userDetails.weightOption' : 1
        }
      }
    ]);

    const bagsWithTotals = await Promise.all(bagsWithUserNames.map(async (bag) => {
      const totalWorn = await calculateWornItemsTotalWeight(bag._id);
      const totalWeightResult = await calculateTotalWeight(bag._id);

      const categoriesOfTheBag = await category.countDocuments({ bagId: bag._id, creator: bag.creator });
      const itemsOfTheBag = await item.countDocuments({ bagId: bag._id, creator: bag.creator });

      return {
        ...bag,
        totalBagWeight: totalWeightResult.totalWeight,
        totalWorn: totalWorn.totalWeight,
        totalCategories: categoriesOfTheBag,
        totalItems: itemsOfTheBag
      };
    }));

    return new NextResponse(JSON.stringify(bagsWithTotals), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to fetch bags", { status: 500 });
  }
}

export const revalidate = 0;
