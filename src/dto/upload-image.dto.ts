import { IsString, Matches } from "class-validator";

export class UploadImageInput {
    @IsString()
    @Matches(/^profile_pictures$|^announces$/)
    type: string;
}