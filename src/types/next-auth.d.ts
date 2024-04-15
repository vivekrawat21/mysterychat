import 'next-auth'
import { DefaultSession } from 'next-auth'
//here i declare the User of next-auth and added the custom type
declare module 'next-auth' {
    interface User {
        _id: string
        isVerified: boolean
        isAcceptingMessages: boolean
        username?: string
    }
    interface Session{
        user: {
            _id?:string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
            username?:string;
        
        }& DefaultSession['user']
    }
}
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string
        isVerified?: boolean
        isAcceptingMessages?: boolean
        username?: string
    }
}