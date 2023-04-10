import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from 'typeorm';
import { UserCreateDto } from "./dto/create-user.dto";
import { ProfileEntity } from "src/profile/entities/profile.entity";
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
            private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity)
            private readonly profileRepository: Repository<ProfileEntity>,
    ) { }


    async findByEnrollment(user_enrollment:string): Promise<UserEntity>{
       return await this.userRepository.findOne(
        {
            where: {user_enrollment: user_enrollment}
        }
       )
    }

    async FindByProfile(id: number): Promise<ProfileEntity> {
        return await this.profileRepository.findOne(
            {
                where: {profile_id: id}
            }
        )
    }


    async create(userCreateDto:UserCreateDto): Promise<UserEntity>{

        const { user_enrollment, user_name, user_password} = userCreateDto

        if (user_enrollment === undefined || user_enrollment.trim()==='') {
            throw new BadRequestException(' A matrícula não pode estar vazio!')
        }

        if (user_name === undefined || user_name.trim()==='') {
            throw new BadRequestException(' O nome de usuário não pode estar vazio!')
        }

        if (user_password === undefined || user_name.trim()==='') {
            throw new BadRequestException(' A senha não pode estar vazia!')
        }


        let user = this.userRepository.create(userCreateDto)

        let profileIsRegistered = await this.FindByProfile(user.user_profile_id)

        if (!profileIsRegistered) {
            throw new NotFoundException('Perfil não existente')
        }

        let isRegistered = await this.findByEnrollment(user.user_enrollment)
        if (isRegistered) {
            throw new BadRequestException('Matrícula de usuário já existe')
        }


        let userSave = await this.userRepository.save(user)

        return userSave
    }

    async getAll(): Promise<UserEntity[]>{

        return await this.userRepository.find();
        
    }




}