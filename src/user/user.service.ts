import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
            private readonly userRepository: Repository<UserEntity>,
    ) { }


    async create(){

    }

    async getAll() {
        return await this.userRepository.find();
    }




}