import item from '../../../../models/item'
import { connectToDB } from "../../../../utils/database"
import { NextResponse } from "next/server"

export const GET = async (req, {params}) => {
     try {

           await connectToDB()

      
           const items = await item.aggregate([
            {
              $match: {
                
                creator: params.id,
                name: { $ne: "", $not: { $regex: /^new item/i } },
              },
            },
            {
              $group: {
                _id: "$name",
                firstItem: { $first: "$$ROOT" },
              },
            },
            {
              $replaceRoot: { newRoot: "$firstItem" },
            },
            {
              $limit: 50,
            },
            {
              $sort: { createdAt: -1 },
            },
          ]);


           return new NextResponse(JSON.stringify(items), {status: 200})
     }

     catch(error) {

        return new NextResponse("Failed to fetch item", {status: 500})
     }
}


