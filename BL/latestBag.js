import bag from '../models/bag'


const getLatestBagForAllTrips = async (userId) => {
    try {
      const latestBag = await bag.findOne({creator: userId}, {}, { sort: { createdAt: -1 } });
      return latestBag || null; // Return null if latestBag is null
    } catch (error) {
      console.error("Error fetching latest bag:", error);
      return null; 
    }
  };


  module.exports = { getLatestBagForAllTrips }