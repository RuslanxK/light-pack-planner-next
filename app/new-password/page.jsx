import React, { Fragment } from 'react'
import NewPassword from '../../components/NewPassword'


const getUser = async (id) => {
  const res = await fetch(`${process.env.API_URL}/api/userToken/${id}`, { cache: 'no-store'});
  if(!res.ok) {

    throw new Error("Sorry, your token expired");
   }
  return res.json()

}


const page =  async ({searchParams}) => {

  const id = searchParams.id

  let user = null;
  let error = null;

  try {
    user = await getUser(id);
  } catch (err) {
    error = err.message;
  }


  return (

    <Fragment>
    <NewPassword user={user} err={error} /> 
    </Fragment>
  )
}

export default page