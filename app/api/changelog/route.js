import post from "../../../models/changeLog";
import { connectToDB } from "../../../utils/database";
import { NextResponse } from "next/server";




export const GET = async (req, { params }) => {

    try {
      await connectToDB();
  
      const Posts = await post.find({});
  
      if (!Posts) {
        return new NextResponse.json({ message: "Not found changes"}, { status: 404 });
      }
  
      return new NextResponse(JSON.stringify(Posts), { status: 200 });
    } catch (error) {
      return new NextResponse.json({ message: "Failed to fetch last changes"}, { status: 500 });
    }
  };




export const POST = async (req) => {
  try {
    await connectToDB();
    
    const { title, description } = await req.json();


    const newPost = await new post({ title, description }).save();
    return NextResponse.json(newPost, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to post to changelog"}, { status: 500 });
  }
};
