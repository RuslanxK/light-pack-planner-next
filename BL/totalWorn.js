import items from '../models/item';

const calculateWornItemsTotalWeight = async (bagId) => {
  try {
    const wornItemsInBag = await items.find({ bagId, worn: true });

    let totalWeight = 0;

    wornItemsInBag.forEach((item) => {
      totalWeight += item.weight * item.qty;
    });

    return { totalWeight };

  } catch (error) {
    console.error("Error calculating total weight of worn items:", error);
    throw { status: 500, message: "Internal Server Error" };
  }
};

module.exports = { calculateWornItemsTotalWeight };
