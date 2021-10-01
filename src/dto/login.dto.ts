import { IsString, IsEmail } from "class-validator";

export default class LoginInput {
    
    @IsEmail({}, { message: "veuillez fournir un email valide"})
    email: string;

    @IsString({ message: "password doit être une chaîne de caractères"})
    password: string;
}