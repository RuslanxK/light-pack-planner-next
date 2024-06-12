import article from '../../../../models/articleModel';
import { connectToDB } from '../../../../utils/database';
import { NextResponse } from "next/server"


export const GET = async (req, {params}) => {
  
  try {

    await connectToDB();
    const foundArticle = await article.findOne({ _id: params.id })
    
    if (!foundArticle) {
      return new NextResponse('Article not found', { status: 404 });
    }
    
    return new NextResponse(JSON.stringify(foundArticle), {status: 200})
  } catch (error) {
    return new NextResponse('Failed to fetch article', { status: 500 });
  }
};