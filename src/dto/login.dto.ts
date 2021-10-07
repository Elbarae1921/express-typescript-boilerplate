import { IsString, IsEmail } from "class-validator";

export default class LoginInput {
    
    @IsEmail({}, { message: "Please provide a valid email"})
    email: string;

    @IsString({ message: "Password is required"})
    password: string;
}