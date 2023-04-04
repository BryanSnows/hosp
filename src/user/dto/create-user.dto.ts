import { ApiProperty } from "@nestjs/swagger";

export class UserCreateDto {
    @ApiProperty()
    user_name: string;

    @ApiProperty()
    user_password: string;

    @ApiProperty()
    user_status: boolean;

    @ApiProperty()
    user_first_access: boolean;

    @ApiProperty()
    user_refresh_token: string;

    @ApiProperty()
    user_profile_id: number;

    @ApiProperty()
    user_enrollment: string;

    @ApiProperty()
    user_password_status: boolean;

}