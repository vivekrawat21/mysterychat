import {z} from 'zod'; 
export const usernameValidation = z.string().min(2,"Username must be atleast 2 characters long").max(20,"Username must be atmost 20 characters long").regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special characters");
//here we do no use object because we only have one field


export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email"}),
    password:z.string().min(6,{message:"Password must be atleast 6 characters long"})
})
//here we have  many field