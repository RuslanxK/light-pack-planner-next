import React, { Fragment } from 'react'
import VerifiedPage from "../../components/VerifiedPage"


const getUser = async (id) => {
  const res = await fetch(`${process.env.API_URL}/api/user/${id}`, { cache: 'no-store'});
  if(!res.ok) {
    console.error()
   }
  return res.json()

}


const page =  async ({searchParams}) => {

  const id = searchParams.id

  const user = await getUser(id)


  return (

    <Fragment>
    <VerifiedPage user={user} /> 
    </Fragment>
  )
}

export default page