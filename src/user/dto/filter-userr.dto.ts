import { ApiProperty } from "@nestjs/swagger";

export class FilterUser {
    @ApiProperty({required: false})
    user_id: number;

    @ApiProperty({required: false})
    search_name: string;

    @ApiProperty({required: false, default: 1})
    page: number;

    @ApiProperty({required: false, default: 10})
    limit: number;

    route: string;
}