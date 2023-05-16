import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UserCreateDto {
    // @IsNotEmpty({message: "campo não pode estar vazio"})
    @ApiProperty()
    user_name: string;

    @ApiProperty()
    user_password: string;


    @ApiProperty()
    user_profile_id: number;

    @ApiProperty()
    user_enrollment: string;

}