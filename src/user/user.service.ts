import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from 'typeorm';
import { UserCreateDto } from "./dto/create-user.dto";
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FilterUser } from "./dto/filter-user.dto";
import { Validations } from "src/common/validations";
import { ObjectSize, ValidType } from "src/common/Enums";
import { ChangePasswordDto } from "src/auth/dto/change-password.dto";
import { hash } from "src/common/hash";
import { ProfileEntity } from "src/access-control/entities/profile.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
            private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity)
            private readonly profileRepository: Repository<ProfileEntity>,
    ) { }


    async findByEnrollment(user_enrollment: string) {
        return this.userRepository.createQueryBuilder('user')
          .leftJoinAndSelect('user.profile', 'profile')
          .leftJoinAndSelect('profile.transactions', 'transactions')
          .where('user.user_enrollment = :user_enrollment', { user_enrollment: user_enrollment })
          .getOne()
      }


    async findByEnrollmentAndProfile(user_enrollment:string){
        return this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('user.user_enrollment = :user_enrollment', {user_enrollment: user_enrollment})
        .getOne()
    }

    async FindByProfile(id: number): Promise<ProfileEntity> {
        return await this.profileRepository.findOne(
            {
                where: {profile_id: id}
            }
        )
    }

//for auth 
     
  async findById(id: number): Promise<UserEntity> {
    Validations.getInstance().validateWithRegex(
      `${id}`,
      ValidType.IS_NUMBER
    )
    if (id > ObjectSize.INTEGER) {
      throw new BadRequestException(`Número de id inválido`)
    }

    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.office', 'office')
      .leftJoinAndSelect('user.shift', 'shift')
      .where('user.user_id = :user_id', { user_id: id })
      .getOne()
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const userSaved = await this.findByEnrollment(changePasswordDto.enrollment);

        if (!userSaved) {
            throw new NotFoundException('Usuário não cadastrado!');
        }

        const newHashedPassword = await hash(changePasswordDto.new_password);

        userSaved.user_password = newHashedPassword;
        userSaved.user_first_access = false;

        return this.userRepository.save(userSaved);
    }


    async updateRefreshToken(id: number, refresh_token: string){

        Validations.getInstance().validateWithRegex(
            `${id}`,
            ValidType.IS_NUMBER
        )

        if (id > ObjectSize.INTEGER) {
            throw new BadRequestException(`Numero de id Invalido`)
        }

        const user = await this.findById(id)

        if (!user) {
            throw new BadRequestException(`Usuario com id ${id} não existe`)
        }

        user.user_refresh_token = refresh_token

        await this.userRepository.save(user)
  
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

        user.user_first_access = false;
        user.user_password_status = true;
        user.user_status =  true;

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

    async getAll(filter: FilterUser): Promise<any |Pagination<UserEntity>> {
        const { user_id, search_name } = filter
        const queryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')

        if (user_id) {
            queryBuilder
            .andWhere('user.user_id = :user_id', {user_id})
        }

        if (search_name) {
            queryBuilder
            .andWhere('user.user_name ilike :user_name', {user_name: `%${search_name}%`})
        }
        

        filter.limit = filter.limit ?? (await queryBuilder.getMany()).length;

        let {items, meta} = await paginate<UserEntity>(queryBuilder, filter);
        
        return meta.totalItems === 0 ?  { message: 'Sem dados Cadastrados', items, meta } : await paginate<UserEntity>(queryBuilder, filter);
        
    }




}