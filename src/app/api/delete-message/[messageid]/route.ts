import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; //t

export async function DELETE(request: Request,{params}:{params:{messageid:string}}) {
    const messageid=params.messageid;
    await dbConnect();


    const session = await getServerSession(authOptions); // Await the getServerSession function call
    const user: User = session?.user as User; //asserted

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            }, { status: 401 });
    }
    try {
        const updatedResult = await UserModel.updateOne({ _id: user._id }, { $pull: { messages: { _id: messageid } } }); //the pull will pull/delete the message which have message idand return the updated document

        if(updatedResult.modifiedCount==0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                }, { status: 404 });
        }
        return Response.json(
            {
                success: true,
                message: "Message deleted successfully"
            }, { status: 200 }
        )
    } catch (error) {
        console.log("error in delete message route"+error)
        return Response.json(
            {
                success: false,
                message: "An error occurred while deleting the message"
            }, { status: 500 }
        )
    }

}