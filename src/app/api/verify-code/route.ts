import dbConnect from "@/lib/dbConnect";
import { z } from 'zod';
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema"; //schema for zod


const verifyCodeQuerySchema = z.object({
    verifyCode: verifySchema
})

export async function POST(request: Request) {

    await dbConnect();
    try {

        const { username, code } = await request.json();//from body

        const decodedUsername = decodeURIComponent(username); // this will decode from username
        const user = await UserModel.findOne({ username: decodedUsername, })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                {
                    status: 404
                })
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully"
            })
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "verification Code expired please get a new code"
            },
                {
                    status: 400
                })
        
        }
        else{
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            },
                {
                    status: 400
                })
        
        }

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        },
            {
                status: 500
            })
    }
}