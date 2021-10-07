import { IsString } from "class-validator";

export class UpdatePfpInput {
    @IsString({ message: "Please choose an image"})
    photo: string;
}