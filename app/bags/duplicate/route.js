import bag from "../../../models/bag";
import categories from "../../../models/categories"
import items from "../../../models/item"
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";


export const POST = async (req, res) => {
  try {
    await connectToDB();

    const { userId, id, name, tripId, goal, description } = await req.json();

    // Create a new bag with no timestamps set
    const newBag = new bag({ creator: userId, name, tripId, goal, description });
    await newBag.save();

    if (id) {
      const existingCategories = await categories.find({ bagId: id });
      const existingItems = await items.find({ bagId: id });

      const categoryMapping = {};

      // Create new categories with timestamps
      const createdCategories = await Promise.all(
        existingCategories.map(async (categoryData) => {
          const { _id, ...restCategoryData } = categoryData.toObject();
          const newCategory = new categories({
            ...restCategoryData,
            bagId: newBag._id,
            createdAt: new Date(), // Set createdAt to current time
            updatedAt: new Date(), // Set updatedAt to current time
          });

          await newCategory.save();
          categoryMapping[_id] = newCategory._id;
          return newCategory;
        })
      );

      newBag.categories = createdCategories.map(category => category._id);
      await newBag.save();

      // Create new items with timestamps
      if (existingItems && existingItems.length > 0) {
        const createdItems = await Promise.all(
          existingItems.map(async (itemData) => {
            const { _id, categoryId, ...restItemData } = itemData.toObject();

            const newItem = new items({
              ...restItemData,
              bagId: newBag._id,
              categoryId: categoryMapping[categoryId],
              productImageKey: null,
              createdAt: new Date(), // Set createdAt to current time
              updatedAt: new Date(), // Set updatedAt to current time
            });

            await newItem.save();
            return newItem;
          })
        );

        newBag.items = createdItems.map(item => item._id);
        await newBag.save();
      }
    }

    return new NextResponse(JSON.stringify({ bag: newBag }), { status: 200 });
  } catch (error) {
    console.error("Error creating new bag:", error);
    return new NextResponse("Failed to create a new bag", { status: 500 });
  }
};

export const revalidate = 0;
