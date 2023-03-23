import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfileService } from "./profile.service";

@Controller('profile')
@ApiTags('Profile')

export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}


    @Post()
    async create(@Body() createProfileDto: CreateProfileDto){
        return this.profileService.create(createProfileDto)
    }
}