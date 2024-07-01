import bag from '../../../../models/bag'
import { connectToDB } from "../../../../utils/database"
import { NextResponse } from "next/server"


export const GET = async (req,{params}) => {

     try {

           await connectToDB()

           const id = params.id

           const bags = await bag.find({creator: id})
           return new NextResponse(JSON.stringify(bags), {status: 200})
     }

     catch(error) {

        return new NextResponse("Failed to fetch bags", {status: 500})
     }
}


