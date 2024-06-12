import items from '../models/item';

const calculateTotalWeight = async (bagId) => {
  try {
    const itemsInBag = await items.find({ bagId });

    let totalWeight = 0;

    itemsInBag.forEach((item) => {
      totalWeight += item.weight * item.qty;
    });

    return { totalWeight };

  } catch (error) {
    console.error("Error calculating total weight of items:", error);
    throw { status: 500, message: "Internal Server Error" };
  }
};

module.exports = { calculateTotalWeight };
