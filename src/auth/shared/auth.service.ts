
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from '../dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { hash, isMatchHash } from 'src/common/hash';
import Tokens from '../interfaces/tokens';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async validateUser(enrollment: string, password: string) {

        const user = await this.userService.findByEnrollment(enrollment);

        if (!user) {
            throw new NotFoundException('Usuário não cadastrado!');
        }

        const checkPass = await isMatchHash(password, user.user_password);

        if (user && checkPass) {
            return user;
        }

        return null;
    }

    async login(user: LoginDTO) {

        const userSaved = await this.userService.findByEnrollmentAndProfile(user.enrollment);

        if (!userSaved.user_status) {
            throw new BadRequestException(`Usuário desativado!`);
        }
        
        if (!userSaved.user_password_status) {
            throw new BadRequestException(`Usuário bloqueado! Entre em contato com o Administrador.`);
        }

        const { access_token, refresh_token } = await this.getTokens(userSaved.user_enrollment, userSaved.user_name, userSaved.profile.profile_name);

        return {
            name: userSaved.user_name,
            enrollment: userSaved.user_enrollment,
            profile: userSaved.profile.profile_name,
            access_token: access_token,
            refresh_token: refresh_token,
        };
        
    }

    async refreshToken(id: number, refreshToken: string) {
        const user = await this.userService.findById(id)

        if (!user) {
            throw new HttpException('User with this enrollment does not exist', HttpStatus.NOT_FOUND);
        }

        if (!user.user_refresh_token) {
            throw new HttpException('Refresh token does not exist on this user', HttpStatus.NOT_FOUND);
        }

        const verifyIfMatchHash = await isMatchHash(refreshToken, user.user_refresh_token);

        if (!verifyIfMatchHash) {
            throw new HttpException('User with this enrollment does not exist', HttpStatus.NOT_FOUND);
        }

        const { access_token, refresh_token } = await this.getTokens(user.user_enrollment, user.user_name, user.profile.profile_name);

        const hashed_refresh_token = await hash(refresh_token);

        await this.userService.updateRefreshToken(user.user_id, hashed_refresh_token)

        return {
            access_token: access_token,
            refresh_token: refresh_token,
            name: user.user_name,
            profile: user.profile.profile_name,
            expires_in: this.configService.get('auth.refresh_token_expires_in')
        }
    }


    async removeRefreshToken(id: number): Promise<any> {
        const user = await this.userService.findById(id)

        if (!user) {
            throw new HttpException('User with this enrollment does not exist', HttpStatus.NOT_FOUND);
        }

        await this.userService.updateRefreshToken(user.user_id, null);
    }

    async getTokens(enrollment: string, name: string, profile_name: string): Promise<Tokens> {

        const [access_token, refresh_token, first_access_token] = await Promise.all([
            this.jwtService.signAsync({
                enrollment: enrollment,
                name: name,
                profile: profile_name,
            },
            {
                secret: this.configService.get('auth.token_secret'),
                expiresIn: this.configService.get('auth.token_expires_in'),
                algorithm: 'HS256'

            }),
            this.jwtService.signAsync({
                enrollment: enrollment,
            },
            {
                secret: this.configService.get('auth.refresh_token_secret'),
                expiresIn: this.configService.get('auth.refresh_token_expires_in'),
                algorithm: 'HS256'
            }),
            this.jwtService.signAsync({
                enrollment: enrollment,
            },
            {
                secret: this.configService.get('auth.first_access_token_secret'),
                expiresIn: this.configService.get('auth.first_access_token_expires_in'),
                algorithm: 'HS256'
            })
        ]);

        return {
            access_token: access_token,
            refresh_token: refresh_token,
            first_access_token: first_access_token
        };
    }


}
