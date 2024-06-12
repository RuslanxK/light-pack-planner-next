
import { Fragment } from 'react'
import InnerArticle from '../../components/InnerArticle';


const getArticle = async (id) => {
  const res = await fetch(`${process.env.API_URL}/api/articles/${id}`, { cache: 'no-store'});
  if(!res.ok) {
    console.error()
   }
  return res.json()

}


const page = async ({searchParams}) => {

  const id = searchParams.id
  const article = await getArticle(id)
  
  return (
   <Fragment>

    <InnerArticle articleData={article} />
    
   </Fragment>

  )
}

export default page