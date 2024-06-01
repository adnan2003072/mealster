import { mongooseConnect } from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  await mongooseConnect();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const user = await User.findOne({email})
    return new NextResponse(JSON.stringify(user));
  } catch (error) {
    return new NextResponse(JSON.stringify({ "Internal server error !": error}));
  }
}

export async function PUT(req) {
  await mongooseConnect();

  try {
    const {email, newChatHistory} = await req.json();

    // updating chat history of a user's chat
    if(newChatHistory) {
      const user = await User.updateOne(
        {email},
        {$set: {chatHistory: newChatHistory}},
        {new: true},
      );

      return new NextResponse(JSON.stringify({ success: true, chats: user.chatHistory }));
    }

  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ "Internal server error !": error}));
  }
}
