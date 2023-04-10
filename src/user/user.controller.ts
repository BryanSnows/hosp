import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/create-user.dto";

@Controller('user')
@ApiTags('User')

export class UserController {
    constructor(private readonly userService: UserService) { }



    @ApiOperation({
        summary: 'Create a User'
    })
    @Post()
    async create(@Body() userCreateDto: UserCreateDto){
        return await this.userService.create(userCreateDto)
    }

    @ApiOperation({
        summary: 'Find All Users'
    })
    @Get()
    async getAll() {
        return await this.userService.getAll()
    }
    
}