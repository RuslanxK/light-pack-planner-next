
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


  const itemsTotal = bag.items?.reduce((acc, item) => acc + item.qty, 0) 

  const categoryWeightsArr = bag.totalWeightCategory 
  const categoryPieChartData = bag.categories.map((category) => {  
  const categoryWeight = categoryWeightsArr.categoriesTotalWeight.find((item) => item.categoryId === category._id)


        return {
          id: category._id,
          value: categoryWeight.totalWeight || 0 ,
          label: category.name,
          color: category.color
        };
      })
    ;

  

  return (
   <Fragment>
     
    <InnerBag bagData={bag} items={items} bags={bags} session={session} itemsTotal={itemsTotal} categoryPieChartData={categoryPieChartData} categoryWeightsArr={categoryWeightsArr} />
    
   </Fragment>

  )
}

export default page