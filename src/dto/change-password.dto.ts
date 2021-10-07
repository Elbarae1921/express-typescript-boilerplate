import { IsString } from "class-validator";

export default class ChangePasswordInput {
    
    @IsString({ message: "Password is required"})
    newPass: string;
    
    @IsString({ message: "Password is required"})
    oldPass: string;
}