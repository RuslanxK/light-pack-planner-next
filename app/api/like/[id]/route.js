import bag from "../../../../models/bag"
import { NextResponse } from "next/server";
import { connectToDB } from "../../../../utils/database";


export const PUT = async (req, { params }) => {
    try {
        await connectToDB();

        const Bag = await bag.findOne({ _id: params.id });

        if (!Bag) {
            return new NextResponse("Bag not found", { status: 404 });
        }

        const { likes } = await req.json();


        if (typeof likes !== 'number') {
            return new NextResponse("Invalid data", { status: 400 });
        }

        Bag.likes = likes;

        await Bag.save();
        return new NextResponse("Bag likes updated successfully", { status: 200 });
    } catch (err) {
        return new NextResponse("Failed to update bag", { status: 500 });
    }
};


export const revalidate = 0;
