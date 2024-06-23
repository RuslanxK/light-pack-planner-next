import ExploreBags from "../../components/ExploreBags"
import { Fragment } from "react"



const getBags = async () => {

  const res = await fetch(`${process.env.API_URL}/bags/explore`, { cache: 'no-store'});
  if (!res.ok) {
    throw new Error("Failed to fetch bags");
  }
     return res.json();
}





const page = async () => {

  const exploreBags = await getBags()

  return (
    <Fragment>
        <ExploreBags exploreBags={exploreBags} />
    </Fragment>
  )
}

export default page