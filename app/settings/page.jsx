import React, { Fragment } from 'react'
import Settings from '../../components/Settings'
import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options'



const getUser = async (session) => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/user/${session?.user?.id}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return [];
  }
};


const page = async () => {

  const session = await getServerSession(options)
  const user = await getUser(session)

    
  return (
    <Fragment>

    <Settings session={session} user={user} />

    </Fragment>
  )
}

export default page