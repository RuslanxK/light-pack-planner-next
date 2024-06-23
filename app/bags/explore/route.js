import bag from '../../../models/bag'
import { connectToDB } from "../../../utils/database"
import { NextResponse } from "next/server"


export const GET = async (req) => {

     try {

           await connectToDB()
           const bags = await bag.find({exploreBags: true})
           return new NextResponse(JSON.stringify(bags), {status: 200})
     }

     catch(error) {

        return new NextResponse("Failed to fetch bags", {status: 500})
     }
}


export const revalidate = 0;