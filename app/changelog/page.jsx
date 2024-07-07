import React, { Fragment } from 'react'
import ChangeLog from "../../components/ChangeLog"



const getPosts = async () => {
  const res = await fetch(`${process.env.API_URL}/api/changelog/`,{ cache: 'no-store'});
  if(!res.ok) {
    throw new Error("Failed to fetch posts");
   }
  return res.json()

}



const page = async () => {


  const posts = await getPosts()

  return (
    <Fragment>
        <ChangeLog posts={posts}/>
    </Fragment>
  )
}

export default page