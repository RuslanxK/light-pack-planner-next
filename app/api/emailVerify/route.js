import { NextResponse } from "next/server";
import { generateRegisterHTML, sendEmail } from "../../../BL/emailBL";

export const POST = async (req) => {
  try {
    const { email, id } = await req.json();

    const emailContent = generateRegisterHTML(id);
    const emailResponse = await sendEmail(
      email,
      "Welcome to Light Pack Planner",
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
