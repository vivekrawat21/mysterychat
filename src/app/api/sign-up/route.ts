import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true // this will only return when the user is verified the find one ad two parameter works like and condition 
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username  already exists",
            },
                {
                    status: 400
                }
            )
        }

        const exisUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (exisUserByEmail) {
           if(exisUserByEmail.isVerified){
            return Response.json({
                success: false,
                message: "user already exists with this email",
            },
                {
                    status: 400
                }
            )
           }
           else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            exisUserByEmail.password = hashedPassword;
            exisUserByEmail.verifyCode = verifyCode;
            exisUserByEmail.verifyCodeExpiry = expiryDate;
            
            await exisUserByEmail.save();
            return Response.json({
                success: true,
                message: "please verify your email to login",
                data: exisUserByEmail
            },
            {status:201}
            )
        }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                message: []
            });

            await newUser.save();

        }
        //send verification email

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, { status: 500 })

        }
        else {
            return Response.json({
                success: true,
                message: "user Registered successfully,please verify your email to login",
                data: {username,email,isVerified:false,isAcceptingMessages:true,
                }
            },{status:201}
            )  }
         }
          catch (error) {
            console.error("Error registering user", error);
            return Response.json({
                success: false,
                message: "Error registering user",
            },
                {
                    status: 500
                }
            )
        }
    }