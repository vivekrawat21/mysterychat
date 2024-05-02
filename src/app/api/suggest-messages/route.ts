import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai'

const genAI = new GoogleGenerativeAI(process.env.API_KEY || '')

// convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(message => message.role === 'user' || message.role === 'assistant')
    .map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }]
    }))
})

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const prompt = " Create a list of three open-ended and engaging question s formatted as a single string, Each question should be seprated by '||' . These questions are for an anonymous social messaging platform , like Qooh.me , and should be suitable for  a diverse audience. Avoid personal or sesitive topics, focusing instead on universel themes that encourage friendly interaction . For example, your output should be structured like this: 'What's hobby you've recently started?|| If you could have dinner with any historical figure, who would it be?|| What's simple thing that makes you happy?'. Ensure the question s are intriguing, foster curosity , and contribut to a positive and welcoming conversational environment."

  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-pro' })
    .generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    })

  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}