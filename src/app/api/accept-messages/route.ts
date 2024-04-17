import { getServerSession } from "next-auth";
import { authOptions } from "../Auth/[...nextAuth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; //this is for type checking 


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions); // Await the getServerSession function call
    const user: User = session?.user as User; //asserted

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "You need to be signed in to accept messages Not authenticated"
            }, { status: 401 });
    }
    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
      const updatedUser =  await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true } //return the updated document
        );
        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "No user found"
                }, { status: 401 });
        }
        return Response.json(
            {
                success: true,
                message: "User message updation status updated successfully ",
                data: updatedUser
            }, { status: 200 });
    }
    catch (error) {
        return Response.json(
            {
                success: false,
                message: "An error occurred while updating the user status"
            }, { status: 500 });
    }
}
export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions); // Await the getServerSession function call
    const user: User = session?.user as User; //asserted

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            }, { status: 401 });
    }
    const userId = user._id;
   const foundUser =  await UserModel.findById(userId);
     try {
           if (!foundUser) {
               return Response.json(
                   {
                       success: false,
                       message: "No user founded"
                   }, { status: 404 });
           }
           return Response.json(
               {
                   success: true,
                   isAcceptingMessages: foundUser.isAcceptingMessages
               }, { status: 200 });
     } catch (error) {
        return Response.json(
            {
                success: false,
                message: "error in getting message accepting status"
            }, { status: 500 }
        )
     }
    }
