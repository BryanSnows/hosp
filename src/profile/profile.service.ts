import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ProfileEntity } from "./entities/profile.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(ProfileEntity)
        private readonly profileRepository: Repository<ProfileEntity>,
    ) { }


    async create(createProfileDto: CreateProfileDto): Promise<ProfileEntity>{
        const {profile_name} = createProfileDto

        if (profile_name.trim() == '' || profile_name == undefined) {
            throw new BadRequestException('O campo não pode estar vazio')
        }

        const profile = this.profileRepository.create(createProfileDto);

        const profileSave = await this.profileRepository.save(profile);

        return profileSave;
    }

    async getAll() {
        return await this.profileRepository.find()
    }

    async findById(id: number): Promise<ProfileEntity> {
        return await this.profileRepository.findOne({where: {profile_id: id}})
      }
    

    async findByName(name: string): Promise<ProfileEntity> {
        return await this.profileRepository.findOne({where: {profile_name: name}})
      }
    


    async update(id:number, updateProfileDto: UpdateProfileDto): Promise<ProfileEntity> {
        const {profile_name } = updateProfileDto

        if (profile_name.trim() == '' || profile_name == undefined) {
          throw new BadRequestException(`O Perfil não pode estar vazio`)
        }
    
        const isRegistered = await this.findById(id)
    
        if (!isRegistered) {
          throw new NotFoundException(`Sem Perfil(s) cadastrado(s)`)
        }
    
        const perfil = await this.profileRepository.preload({
        profile_id: id,
          ...updateProfileDto
        })
    
    
    
    
        const registrationIsRegistered = await this.findByName(perfil.profile_name)
    
           if (registrationIsRegistered) {
              throw new BadRequestException(`Perfil: ${perfil.profile_name}, já cadastrado!`)
        }
    
        
        await this.profileRepository.save(perfil)
    
        return this.findById(id)
    
    }


}