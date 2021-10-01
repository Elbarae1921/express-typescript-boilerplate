import { IsString } from "class-validator";

export default class ChangePasswordInput {
    
    @IsString({ message: "Password doit être une chaîne de caractères"})
    newPass: string;
    
    @IsString({ message: "Password doit être une chaîne de caractères"})
    oldPass: string;
}