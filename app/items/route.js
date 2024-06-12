import { connectToDB } from "../../utils/database";
import item from "../../models/item"
import { NextResponse } from "next/server";

export const PUT = async (req, res) => {

    try {

      await connectToDB();
      
      const { items } = await req.json();

      for (const updatedItem of items) {
        const Item = await item.findOne({ _id: updatedItem._id });
        if (Item) {
            Item.order = updatedItem.order;
          await Item.save();
        }
      }

      return new NextResponse('Items updated successfully', { status: 200 });
    } catch (err) {
        return new NextResponse("Failed to update items", { status: 500 });
    }
  
}

export const revalidate = 0;