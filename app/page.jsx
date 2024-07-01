import { Fragment } from 'react';
import Trips from '../components/Trips'
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options'

const getBags = async (session) => {
  try {
    const res = await fetch(`${process.env.API_URL}/bags/${session?.user?.id}/creator`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error("Failed to fetch bags");
    }
    return { data: await res.json() };
  } catch (error) {
    console.error(error);
    return { error: "Could not retrieve your bags at this time. Please try again later." };
  }
}

const getData = async (session) => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/trips/${session?.user?.id}/creator`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error("Failed to fetch trips");
    }
    const data = await res.json();

    const latestBag = data.latestBag;
    const latestBagTotalWeight = data.latestBagTotalWeight;
    const totalCategories = data.totalCategories;
    const totalItems = data.totalItems;

    const picturePromises = data.trips.map(async (trip) => {
      const getPicture = await fetch(`https://api.unsplash.com/search/photos?query=${trip.name}&${process.env.UNSPLASH_CLIENT}`);
      if (!getPicture.ok) {
        throw new Error("Failed to fetch trip picture");
      }
      const pictureData = await getPicture.json();
      const picture = pictureData.results && pictureData.results.length > 0 ? pictureData.results[0] : null;
      const url = picture ? picture.urls.regular : null;
      return { ...trip, url };
    });

    const tripsWithPictures = await Promise.all(picturePromises);
    return { data: { tripsWithPictures, latestBag, latestBagTotalWeight, totalCategories, totalItems } };
  } catch (error) {
    console.error(error);
    return { error: "Could not retrieve your trips at this time. Please try again later." };
  }
}


const Home = async () => {
  const session = await getServerSession(options);

  const dataResult = await getData(session);
  const bagsResult = await getBags(session);

  return (
    <Fragment>
      <Trips 
        trips={dataResult.data} 
        bags={bagsResult.data} 
        error={dataResult.error || bagsResult.error} 
        session={session} 
      />
    </Fragment>
  )
}

export default Home
