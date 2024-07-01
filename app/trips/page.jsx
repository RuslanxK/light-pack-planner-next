
import { Fragment } from 'react'
import InnerTrip from '../../components/InnerTrip'
import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options'



const getBags = async (session) => {

  const res = await fetch(`${process.env.API_URL}/bags/${session?.user?.id}/creator`, { cache: 'no-store'});
  if (!res.ok) {
    throw new Error("Failed to fetch bags");
  }
     return res.json();
}


const getTrips = async (session) => {
  const res = await fetch(`${process.env.API_URL}/api/trips/${session?.user?.id}/creator`,  { cache: 'no-store'});
  if (!res.ok) {
    throw new Error("Failed to fetch trips");
   }
   return res.json()
}


const getTrip = async (id, session) => {
  const res = await fetch(`${process.env.API_URL}/api/trips/${id}/${session?.user?.id}`, { cache: 'no-store'});
  if(!res.ok) {
    throw new Error("Failed to fetch trip");
   }
  return res.json()

}

const page = async({searchParams}) => {

  const session = await getServerSession(options)
  const id = searchParams.id

  const trip = await getTrip(id, session)
  const trips = await getTrips(session)
  const bags = await getBags(session)


  return (
   <Fragment>

    <InnerTrip tripData={trip} trips={trips.trips} bagsData={bags} session={session}  />

   </Fragment>

  )
}

export default page