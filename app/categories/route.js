import { connectToDB } from "../../utils/database";
import category from "../../models/categories"
import { NextResponse } from "next/server";

export const PUT = async (req, res) => {

    try {

      await connectToDB();
      
      const { categories } = await req.json();

      for (const updatedCategory of categories) {
        const Category = await category.findOne({ _id: updatedCategory._id });
        if (Category) {
          Category.order = updatedCategory.order;
          await Category.save();
        }
      }

      return new NextResponse('Categories updated successfully', { status: 200 });
    } catch (err) {
        return new NextResponse("Failed to update categories", { status: 500 });
    }
  
}

export const revalidate = 0;