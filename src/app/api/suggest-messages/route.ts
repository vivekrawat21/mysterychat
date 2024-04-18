import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// Set the runtime to edge for best performance
export const runtime = 'edge';
 
export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging question s formatted as a single string, Each question should be seprated by '||' . These questions are for an anonymous social messaging platform , like Qooh.me , and should be suitable for  a diverse audience. Avoid personal or sesitive topics, focusing instead on universel themes that encourage friendly interaction . For example, your output should be structured like this: 'What's hobby you've recently started?|| If you could have dinner with any historical figure, who would it be?|| What's simple thing that makes you happy?'. Ensure the question s are intriguing, foster curosity , and contribut to a positive and welcoming conversational environment."
   
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      max_tokens: 10,
      stream: true,
      prompt
    });
   
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    if(error instanceof OpenAI.APIError){
        const {name ,status ,headers ,message} = error;
        return NextResponse.json({name ,status ,headers ,message} ,{status})

    }
    else{
        console.error("an unexpected error occured"+error);
    }
    
  }
}