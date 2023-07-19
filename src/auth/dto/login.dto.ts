import { ApiProperty } from "@nestjs/swagger"


export class LoginDTO{

    @ApiProperty({
        example: "000000"
    })
    enrollment: string

    @ApiProperty({
        example: "hosp@2023"
    })
    password: string

}