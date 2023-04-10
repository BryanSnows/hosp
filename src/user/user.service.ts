import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from 'typeorm';
import { UserCreateDto } from "./dto/create-user.dto";
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
            private readonly userRepository: Repository<UserEntity>,
    ) { }


    async create(userCreateDto:UserCreateDto){
        const { user_enrollment } = userCreateDto

        if (user_enrollment === undefined) {
            throw new BadRequestException(' O nome de usuário não pode estar vazio!')
        }

        let user = this.userRepository.create(userCreateDto)
        let userSave = await this.userRepository.save(user)

        return userSave
    }

    async getAll() {
        return await this.userRepository.find();
    }




}