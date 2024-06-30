import {Fragment} from 'react'
import BugReport from "../../components/BugReport"
import { options } from '../api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth';

const page = async () => {


  const session = await getServerSession(options)
  
  return (
    <Fragment>
      
      <BugReport session={session} />
      
    </Fragment>
  )
}

export default page