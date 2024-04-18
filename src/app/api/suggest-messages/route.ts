import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
 
export async function POST(req: Request) {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY||"");
  try {
   const model = genAI.getGenerativeModel({model:'gemini-pro'})

   const prompt = " Create a list of three open-ended and engaging question s formatted as a single string, Each question should be seprated by '||' . These questions are for an anonymous social messaging platform , like Qooh.me , and should be suitable for  a diverse audience. Avoid personal or sesitive topics, focusing instead on universel themes that encourage friendly interaction . For example, your output should be structured like this: 'What's hobby you've recently started?|| If you could have dinner with any historical figure, who would it be?|| What's simple thing that makes you happy?'. Ensure the question s are intriguing, foster curosity , and contribut to a positive and welcoming conversational environment."
   const result = await model.generateContent(prompt);
   const response = await result.response;
   const text = response.text();
   console.log(text);
   return NextResponse.json({success: true, message: text}, {status: 200});
  } catch (error) {
     return NextResponse.json(
      {
      success: false,
      data:"Error occured while generating the message. Please try again later."}, {status: 500});
    }
}