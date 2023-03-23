import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfileEntity } from "./entities/profile.entity";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(ProfileEntity)
        private readonly profileRepository:  Repository<ProfileEntity>,
    ){}


    async create(createProfileDto: CreateProfileDto){
        const {profile_name} = createProfileDto

        if (profile_name.trim() == '' || profile_name == undefined) {
            throw new BadRequestException('O campo não pode estar vazio')
        }
    }
}