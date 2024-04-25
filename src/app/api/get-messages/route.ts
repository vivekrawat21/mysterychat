import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; //this is for type checking 
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions); // Await the getServerSession function call
    const user: User = session?.user as User; //asserted

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "You need to be signed in to get messages Not authenticated"
            }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(user._id); //this will convert the string id to ObjectId it is reuired while using aggregation pipeline
    try {
        const user = await UserModel.aggregate([
            {$match: { _id: userId } },
            {
                $unwind: "$messages"
            }
            ,
            {
                $sort: { "messages.createdAt":-1}
            }
            ,
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ]);
        if (!user||user.length===0) {
            return Response.json(
                {
                    success: false,
                    message: "No user found"
                }, { status: 401 });
        }
        return Response.json(
            {
                success: true,
                message: "User messages fetched successfully ",
                messages: user[0].messages
            }, { status: 200 });
    }
    catch (error) {
        return Response.json(
            {
                success: false,
                message: "An error occurred while fetching the user messages"
            }, { status: 500 });
    }
}