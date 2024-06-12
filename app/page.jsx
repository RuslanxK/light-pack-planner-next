
import { Fragment } from 'react';
import Trips from '../components/Trips'
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options'


const getBags = async (session) => {

  const res = await fetch(`${process.env.API_URL}/bags/${session?.user?.id}/creator`, { cache: 'no-store'});
  if (!res.ok) {
    throw new Error("Failed to fetch bags");
  }
  return res.json();

}


const getData = async (session) => {


  try { 

    const res = await fetch(`${process.env.API_URL}/api/trips/${session?.user?.id}/creator`, {cache: 'no-store'});
  ;
    const data = await res.json();
     const latestBag = data.latestBag
          const latestBagTotalWeight = data.latestBagTotalWeight
          const totalCategories = data.totalCategories
          const totalItems = data.totalItems
          const picturePromises = data.trips.map(async (trip) => {
            const getPicture = await fetch(`https://api.unsplash.com/search/photos?query=${trip.name}&${process.env.UNSPLASH_CLIENT}`);
            const pictureData = await getPicture.json();
            const picture = pictureData.results && pictureData.results.length > 0 ? pictureData.results[0] : null;
            const url = picture.urls.regular
            return { ...trip, url };
          });
      
          const tripsWithPictures = await Promise.all(picturePromises);
        return {tripsWithPictures, latestBag, latestBagTotalWeight, totalCategories, totalItems};
  
  }
   
  catch(error) {
     console.error(error)
  }
}


const Home = async () => {

  const session = await getServerSession(options)

  const data = await getData(session)
  const bags = await getBags(session)

  
  return (
 
   <Fragment>
   <Trips trips={data} bags={bags} session={session} />
   </Fragment>


  )
}




export default Home


