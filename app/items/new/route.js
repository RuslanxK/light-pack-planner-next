import item from '../../../models/item'
import { connectToDB } from '../../../utils/database'
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    try {
      await connectToDB();

      const { userId, tripId, bagId, categoryId, name, qty, description, weight, wgtOpt, priority, link, worn, price } = await req.json();

      const existingCategoriesCount = await item.countDocuments({ categoryId });

      const order = existingCategoriesCount + 1;

      const Item = new item({ creator: userId, tripId, bagId, categoryId, name, qty, description, weight, wgtOpt, priority, link, worn, order, price});
      await Item.save();
      return new NextResponse(JSON.stringify(Item), { status: 200 });
    } catch (error) {
      return new NextResponse("Failed to post items", { status: 500 });
    }
  };
  

