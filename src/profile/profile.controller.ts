import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfileEntity } from "./entities/profile.entity";
import { ProfileService } from "./profile.service";

@Controller('profile')
@ApiTags('Profile')

export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}


    @Post()
    async create(@Body() createProfileDto: CreateProfileDto): Promise<ProfileEntity>{
        return this.profileService.create(createProfileDto)
    }

    @Get()
    async getAll() {
        return this.profileService.getAll()
    }
}