
import { Fragment } from 'react'
import InnerTrip from '../../components/InnerTrip'
import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options'



const getBags = async (session) => {

  try {
   const res = await fetch(`${process.env.API_URL}/bags/${session?.user?.id}/creator`, { cache: 'no-store'});
   return res.json();
  }
  
  catch(error) {

    return { error: "Could not retrieve your bags at this time. Please try again later." }
  }
     
}


const getTrips = async (session) => {
  const res = await fetch(`${process.env.API_URL}/api/trips/${session?.user?.id}/creator`,  { cache: 'no-store'});
  if (!res.ok) {
  console.error()
   }
   return res.json()
}


const getTrip = async (id, session) => {

  try {
  const res = await fetch(`${process.env.API_URL}/api/trips/${id}/${session?.user?.id}`, { cache: 'no-store'});
  return res.json()
  }
 
  catch(error) {

    return { error: "Something went wrong." }
  }
 

}

const page = async({searchParams}) => {

  const session = await getServerSession(options)
  const id = searchParams.id

  const trip = await getTrip(id, session)
  const trips = await getTrips(session)
  const bags = await getBags(session)


  return (
   <Fragment>

    <InnerTrip tripData={trip} trips={trips.trips} bagsData={bags} error={trip.error} session={session}  />

   </Fragment>

  )
}

export default page