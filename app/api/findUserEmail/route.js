import { NextResponse } from "next/server";
import { connectToDB } from '../../../utils/database';
import user from '../../../models/user';
import { generateForgotPasswordHTML, sendEmail } from "../../../BL/emailBL"
import { v4 as uuidv4 } from 'uuid'



export const POST = async (req) => {
  
    try {

      await connectToDB();

      const { email } = await req.json();
      const passwordResetToken = uuidv4();

      const foundUser = await user.findOne({ email: email })
      
      if (!foundUser) {
        
        return new NextResponse('The email does not exist.', { status: 404 });
      }

      if(foundUser) {

        foundUser.emailToken = passwordResetToken;
        foundUser.passwordResetTokenExpires = new Date()
        await foundUser.save();
        const emailContent = generateForgotPasswordHTML(foundUser.emailToken);

       const emailResponse = await sendEmail(
        email,
        "Resetting your Light Pack Planner account password",
        emailContent
      );

      
      return new NextResponse(JSON.stringify(foundUser), {status: 200})
      }
  
    } catch (error) {
  
      return new NextResponse('Something went wrong', { status: 500 });
    }
  };
  