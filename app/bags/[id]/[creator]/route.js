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
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";


const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});


export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const foundBag = await bag.findOne({ _id: params.id, creator: params.creator});

    const totalWorn = await calculateWornItemsTotalWeight(params.id);
    const totalWeightCategory = await calculateCategoryTotalWeight(params.id);
    const totalWeightResult = await calculateTotalWeight(params.id);

    const categoriesOfTheBag = await category.find({ bagId: params.id, creator: params.creator });
    const itemsOfTheBag = await item.find({ bagId: params.id, creator: params.creator });

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




export const PUT = async (req, { params }) => {
  try {
    await connectToDB();

    const Bag = await bag.findOne({ _id: params.id, creator: params.creator });

    if (!Bag) {
      return new NextResponse("Bag not found", { status: 404 });
    }

    const updateData = await req.json();

    Object.assign(Bag, updateData);

    await Bag.save();
    return new NextResponse("Bag is Updated Successfully", { status: 200 });
  } catch (err) {
    return new NextResponse("Failed to update bag", { status: 500 });
  }
};



export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    const itemsOfTheBag = await item.find({ bagId: params.id, creator: params.creator });

    const deletePromises = itemsOfTheBag.map((item) => {
      if (item.productImageKey) {
        const deleteObjectCommand = new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: item.productImageKey,
        });

        return s3.send(deleteObjectCommand);
      }
      return Promise.resolve();
    });

    await Promise.all(deletePromises);


    await bag.findByIdAndDelete({ _id: params.id, creator: params.creator});
    await category.deleteMany({ bagId: params.id, creator: params.creator });
    await item.deleteMany({ bagId: params.id, creator: params.creator });
    return new NextResponse("Bag is Deleted Successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Failed to delete bag", { status: 500 });
  }
};

