import { Fragment } from 'react'
import Articles from '../../components/Articles';
import { options } from '../api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth';



const getArticles = async () => {

    const res = await fetch(`${process.env.API_URL}/api/articles`, { cache: 'no-store'});
    if (!res.ok) {
      throw new Error("Failed to fetch bags");
    }
       return res.json();
  }
  


  const page = async () => {

    const session = await getServerSession(options)
    const articles = await getArticles()
  
  
    return (
     <Fragment>
      
  
      <Articles articles={articles} session={session} />
  
     </Fragment>
  
    )
  }
  
  export default page