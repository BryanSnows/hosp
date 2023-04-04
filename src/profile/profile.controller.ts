import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfileEntity } from "./entities/profile.entity";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller('profile')
@ApiTags('Profile')

export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}


    @Post()
    async create(@Body() createProfileDto: CreateProfileDto): Promise<ProfileEntity>{
        return await this.profileService.create(createProfileDto)
    }

    @Get()
    async getAll() {
        return await this.profileService.getAll()
    }

    @Put(':id')
    update(@Param('id')id: number, @Body() updateProfileDto: UpdateProfileDto): Promise<ProfileEntity> {
        return this.profileService.update(+id, updateProfileDto)
      }
    

}