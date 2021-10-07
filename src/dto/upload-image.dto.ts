import { IsString, Matches } from "class-validator";

export class UploadImageInput {
    @IsString()
    @Matches(/^profile_pictures$|^announces$/, { message: "Type must be 'profile_pictures' or 'announces'"})
    type: string;
}