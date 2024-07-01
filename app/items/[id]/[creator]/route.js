import item from "../../../../models/item";
import { NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/database";



export const PUT = async (req, { params }) => {
  try {
    await connectToDB();
   
    const Item = await item.findOne({ _id: params.id, creator: params.creator});

    if (!Item) {
      return new NextResponse('Item not found', { status: 404 });
    }

    const { tripId, bagId, categoryId, name, priority, description, qty, weight, link, worn, price, selected } = await req.json();

    Object.assign(Item, { tripId, bagId, categoryId, name, priority, description, qty, weight, link, worn, price, selected});

    await Item.save();
    return new NextResponse(JSON.stringify(Item), { status: 200 });
  } catch (err) {
    return new NextResponse('Failed to update item', { status: 500 });
  }
};




export const DELETE = async (req, {params}) => {

    try {

    await connectToDB();
    await item.findByIdAndDelete({ _id: params.id, creator: params.creator});
    return new NextResponse("Item is Deleted Successfully", {
      status: 200,
    });
  } catch (error) {
    console.error(error)
    return new NextResponse("Failed to delete category", { status: 500 });
    
  }
};


