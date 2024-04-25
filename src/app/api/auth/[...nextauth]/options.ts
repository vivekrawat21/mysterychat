import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Enter your email" },
                password: { label: "Password", type: "password" }
            },
            //because credentials is our so the authorize should also be our
            async authorize   (credentials:any):Promise<any>{
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {
                                email: credentials.identifier
                            },
                            {
                                username: credentials.identifier
                            }
                        ]
                    });
                    if(!user){
                        throw new Error("No user found");
                    }
                    if(!user.isVerified){
                        throw new Error("Verify your account first");
                    }
                   const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                   if(isPasswordCorrect){
                    return user;
                   }
                   else{
                       throw new Error("Invalid password");
                   }
                   //Now all the credentials will returned to the provider and we can access that using the Provider
                
                } catch (error:any) {
                    throw new Error(error);
                }
            }            
        })
    ],
     callbacks:{
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        }
     },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret: process.env.SECRET,
}