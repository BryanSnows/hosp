
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from '../dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { hash, isMatchHash } from 'src/common/hash';
import Tokens from '../interfaces/tokens';
import { Validations } from 'src/common/validations';
import { ValidType } from 'src/common/Enums';
import { FirstAccessDto } from '../dto/first-access.dto';

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

        const userSaved = await this.userService.findByEnrollment(user.enrollment);
    
        if (!userSaved.user_status) {
            throw new BadRequestException(`Usuário desativado!`);
        }
        
        if (!userSaved.user_password_status) {
            throw new BadRequestException(`Usuário bloqueado! Entre em contato com o Administrador.`);
        }

        userSaved.profile.transactions = userSaved.profile.transactions.filter((transaction) => transaction.transaction_status);
        const transactions = userSaved.profile.transactions.map((transaction) => transaction.transaction_number);

        const { access_token, refresh_token, first_access_token } = await this.getTokens(userSaved.user_enrollment, userSaved.user_name, userSaved.user_profile_id, transactions);

        if (userSaved.user_first_access) {
            return {
                first_access_token: first_access_token
            };
        }

        await this.userService.updateRefreshToken(userSaved.user_id, await hash(refresh_token));

        return {
            name: userSaved.user_name,
            enrollment: userSaved.user_enrollment,
            profile: userSaved.profile,
            access_token: access_token,
            refresh_token: refresh_token,
        };
        
    }
    async firstAccess(enrollment: string, firstAccessDto: FirstAccessDto) {
        const { current_password, new_password, confirmation_password } = firstAccessDto;

        const userSaved = await this.userService.findByEnrollment(enrollment);

        Validations.getInstance().validateWithRegex(
            firstAccessDto.new_password, 'new_password',
            ValidType.NO_SPACE,
            ValidType.MINIMUM_ONE_NUMBER_STRING_SPECIAL_CHARACTER,
        )
      
          Validations.getInstance().verifyLength(
            firstAccessDto.new_password, 'new_password', 6, 12
        )

        Validations.getInstance().validateWithRegex(
            firstAccessDto.confirmation_password, 'confirmation_password',
            ValidType.NO_SPACE,
            ValidType.MINIMUM_ONE_NUMBER_STRING_SPECIAL_CHARACTER,
        )
      
          Validations.getInstance().verifyLength(
            firstAccessDto.confirmation_password, 'confirmation_password', 6, 12
        )
      

        if (!userSaved) {
            throw new NotFoundException( 'Usuário não cadastrado!');
        }

        const checkCurrentPassword = await isMatchHash(current_password, userSaved.user_password);

        if (!checkCurrentPassword) {
            throw new UnauthorizedException('Senha de primeiro acesso incorreta!');
        }

        if ((new_password === current_password) || (confirmation_password === current_password)) {
            throw new UnauthorizedException('A nova senha não pode coincidir com a anterior!');
        }

        if (new_password !== confirmation_password) {
            throw new UnauthorizedException('A senha e confirmação de senha não coincidem!');
        }

        return this.userService.changePassword({ enrollment, new_password });
    }

    async refreshToken(enrollment: string, refreshToken: string) {
        const user = await this.userService.findByEnrollment(enrollment)

        if (!user) {
            throw new HttpException('User with this enrollment does not exist', HttpStatus.NOT_FOUND);
        }

        if (!user.user_refresh_token) {
            throw new HttpException('Refresh token does not exist on this user', HttpStatus.NOT_FOUND);
        }

        const verifyIfMatchHash = await isMatchHash(refreshToken, user.user_refresh_token);

        if (!verifyIfMatchHash) {
            throw new HttpException('Refresh token does not match', HttpStatus.NOT_FOUND);
        }

        user.profile.transactions = user.profile.transactions.filter((transaction) => transaction.transaction_status);
        const transactions = user.profile.transactions.map((transaction) => transaction.transaction_number);

        const { access_token, refresh_token } = await this.getTokens(user.user_enrollment, user.user_name, user.user_profile_id, transactions);

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

    async getTokens(enrollment: string, name: string, profile_id: number,  transactions: number[]): Promise<Tokens> {

        const [access_token, refresh_token, first_access_token] = await Promise.all([
            this.jwtService.signAsync({
                enrollment: enrollment,
                name: name,
                profile: profile_id,
                transactions: transactions
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
