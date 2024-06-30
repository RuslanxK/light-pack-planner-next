import { NextResponse } from "next/server";
import { reportEmail, sendReportEmail } from "../../../BL/emailBL";

export const POST = async (req) => {
  try {
    const { user, title, content } = await req.json();


    
    const emailContent = reportEmail(title, content, user);
    const emailResponse = await sendReportEmail(
      user.email,
      "User sent message",
      emailContent
    );

    if (emailResponse.success) {
      return NextResponse.json(
        { message: emailResponse.message },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: emailResponse.message },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
};

export const revalidate = 0;
