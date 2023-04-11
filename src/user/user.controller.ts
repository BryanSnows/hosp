import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { Pagination } from "nestjs-typeorm-paginate";
import { FilterUser } from "./dto/filter-userr.dto";

@Controller('user')
@ApiTags('User')

export class UserController {
    constructor(private readonly userService: UserService) { }



    @ApiOperation({
        summary: 'Create a User'
    })
    @Post()
    async create(@Body() userCreateDto: UserCreateDto): Promise<UserEntity>{
        return await this.userService.create(userCreateDto)
    }

    @ApiOperation({
        summary: 'Find All Users'
    })
    @Get()
    async getAll(@Query() filter: FilterUser): Promise<Pagination<UserEntity>>{
        return await this.userService.getAll(filter)
    }
    
}