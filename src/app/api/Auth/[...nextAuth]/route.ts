import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);
//NextAuth is a function that takes the options and returns a handler
export {handler as GET, handler as POST};