import bag from '../../../models/bag';
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";

export const GET = async (req) => {
    try {
        await connectToDB();

        const bagsWithUserNames = await bag.aggregate([
            { $match: { exploreBags: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creator',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    creator: 1,
                    exploreBags: 1,
                    goal: 1,
                    passed: 1,
                    likes: 1,
                    'userDetails.username': 1 
                }
            }
        ]);

        return new NextResponse(JSON.stringify(bagsWithUserNames), { status: 200 });
    } catch (error) {
        return new NextResponse("Failed to fetch bags", { status: 500 });
    }
}

export const revalidate = 0;