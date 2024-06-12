import bag from "../../../../models/bag";
import { connectToDB } from "../../../../utils/database";
import { NextResponse } from "next/server";
import category from "../../../../models/categories";
import item from "../../../../models/item";
const { calculateTotalWeight } = require("../../../../BL/totalBagKg");
const {
  calculateCategoryTotalWeight,
} = require("../../../../BL/totalCategoryKg");
const { calculateWornItemsTotalWeight } = require("../../../../BL/totalWorn");

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const foundBag = await bag.findOne({ _id: params.id});

    const totalWorn = await calculateWornItemsTotalWeight(params.id);
    const totalWeightCategory = await calculateCategoryTotalWeight(params.id);
    const totalWeightResult = await calculateTotalWeight(params.id);

    const categoriesOfTheBag = await category.find({ bagId: params.id });
    const itemsOfTheBag = await item.find({ bagId: params.id});

    if (!foundBag) {
      return new NextResponse("Bag not found", { status: 404 });
    }

    const bagWithCategoriesAndItems = {
      bag: foundBag,
      categories: categoriesOfTheBag,
      items: itemsOfTheBag,
      totalBagWeight: totalWeightResult.totalWeight,
      totalWeightCategory: totalWeightCategory,
      worn: totalWorn.totalWeight,
    };

    return new NextResponse(JSON.stringify(bagWithCategoriesAndItems), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Failed to fetch bag", { status: 500 });
  }
};

