import { z } from "zod";

export const MessageSchema = z.object({
   content:z.string().min(10,"Message must be atleast 10 character long").max(300,"Message must be atmost 300 characters long")

})