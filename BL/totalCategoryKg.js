import items from '../models/item';
import categories from '../models/categories';

const calculateCategoryTotalWeight = async (bagId) => {
  try {
    const categoriesInBag = await categories.find({ bagId });

    const categoriesTotalWeight = [];

    for (const category of categoriesInBag) {
      const itemsInCategory = await items.find({ categoryId: category._id.toString() });

      let totalWeight = 0;

      itemsInCategory.forEach((item) => {
        totalWeight += item.weight * item.qty;
      });

      categoriesTotalWeight.push({ categoryId: category._id, totalWeight });
    }

    return { categoriesTotalWeight };

  } catch (error) {
    console.error("Error calculating total weight for each category:", error);
    throw { status: 500, message: "Internal Server Error" };
  }
};

module.exports = { calculateCategoryTotalWeight };