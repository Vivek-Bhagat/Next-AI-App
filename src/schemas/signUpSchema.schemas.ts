
import { z } from "zod";


export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 character")
    .max(2, "Username must be no more than 20 character")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contail special character")



export const signUpSchema = z.object({
    username: usernameValidation,
    emiil: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6,{message: "Password must be atleast 6 charcter"})
})    


