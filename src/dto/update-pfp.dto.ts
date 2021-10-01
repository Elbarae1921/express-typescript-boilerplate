import { IsString } from "class-validator";

export class UpdatePfpInput {
    @IsString({ message: "Veuillez choisir une image"})
    photo: string;
}