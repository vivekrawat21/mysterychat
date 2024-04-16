import dbConnect from "@/lib/dbConnect";
import { z } from 'zod';
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema"; //schema for zod


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    //TODO use this  in all other routes
    // if(request.method !== "GET"){
    //     return Response.json({
    //         success: false,
    //         message: "Invalid request method only get method allowed"
    //     },
    //         {
    //             status: 405
    //         })
    // } no need of this in now next newwer version of nextjs

    
    await dbConnect();
    //localhost:3000/api/check-username-unique?username=abc
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result); //TODO remove
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: "Invalid username",
                errors: usernameErrors
            },
                {
                    status: 400
                })
        }
        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken"
            },
                {
                    status: 400
                })
        }
        return Response.json({
            success: true,
            message: "Username is unique"
        },
            {
                status: 400
            })

    } catch (error) {
        console.error("Error checnking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },
            {
                status: 500
            }
        )

    }
}
