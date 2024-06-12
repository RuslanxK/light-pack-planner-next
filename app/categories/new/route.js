import category from "../../../models/categories";
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const { userId, name, bagId, tripId } = await req.json();

    const existingCategoriesCount = await category.countDocuments({ bagId });

    const order = existingCategoriesCount;

    const Category = new category({ creator: userId, name, bagId, tripId, order });
    await Category.save();
    return new NextResponse(JSON.stringify(Category), { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to post trips", { status: 500 });
  }
};


export const revalidate = 0;
