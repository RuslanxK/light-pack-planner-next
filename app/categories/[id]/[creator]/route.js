import category from "../../../../models/categories";
import item from "../../../../models/item";
import { NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/database";


export const DELETE = async (req, {params}) => {
  try {

    await connectToDB();

    await category.findByIdAndDelete({_id: params.id, creator: params.creator});
    await item.deleteMany({ categoryId: params.id, creator: params.creator });
    return new NextResponse("Category is Deleted Successfully", {
      status: 200,
    });
  } catch (error) {
    console.error(error)
    return new NextResponse("Failed to delete category", { status: 500 });
    
  }
};


export const PUT = async (req, { params }) => {
  try {
    const Category = await category.findOne({ _id: params.id, creator: params.creator });

    if (!Category) {
      return new NextResponse('Category not found', { status: 404 });
    }

    const { name, order } = await req.json();

    Object.assign(Category, { name });
   
    if (order !== undefined) {
      Object.assign(Category, { order });
    }

    await Category.save();

    return new NextResponse('Category is Updated Successfully', { status: 200 });
  } catch (err) {
    return new NextResponse('Failed to update category', { status: 500 });
  }
};

export const revalidate = 0;
