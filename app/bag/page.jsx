
import { Fragment } from 'react'
import InnerBag from '../../components/InnerBag'
import { getServerSession } from 'next-auth';
import {options} from '../api/auth/[...nextauth]/options'


const getBags = async (session) => {

  const res = await fetch(`${process.env.API_URL}/bags/${session?.user?.id}/creator`, { cache: 'no-store'});
  if (!res.ok) {
    throw new Error("Failed to fetch bags");
  }
     return res.json();
}


const getItems = async (session) => {
  const res = await fetch(`${process.env.API_URL}/items/${session?.user?.id}/creator`,  { cache: 'no-store'});
  if (!res.ok) {
  console.error()
   }
   return res.json()
}


const getBag = async (id, session) => {
  const res = await fetch(`${process.env.API_URL}/bags/${id}/${session?.user?.id}`, { cache: 'no-store'});
  if(!res.ok) {
    console.error()
   }
  return res.json()

}


const page = async ({searchParams}) => {
  const session = await getServerSession(options)
  const id = searchParams.id

  const bag = await getBag(id, session)
  const items = await getItems(session)
  const bags = await getBags(session)

  return (
   <Fragment>
     
    <InnerBag bagData={bag} items={items} bags={bags} session={session}/>
    
   </Fragment>

  )
}

export default page