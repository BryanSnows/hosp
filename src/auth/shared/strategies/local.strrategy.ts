import { BadRequestException, GoneException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { VerifyCredentials } from "src/common/Enums";
import { AuthService } from "../auth.service";
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, 
        private userService: UserService,) {
        super({
            usernameField: VerifyCredentials.verify_enrollment,
            passwordField: VerifyCredentials.verify_password
        })
    }

    async validate(enrollment: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(enrollment, password);
        const userFirst =  await this.userService.findByEnrollment(enrollment)

        // if (!user && userFirst.user_status === false) {
        //     throw new BadRequestException(`Usuário desativado!`)
        // } else {
        //     if (!user && userFirst.user_first_access === false  && userFirst.user_password_status === true) {
        //         throw new UnauthorizedException(`Usuário inválido!`);
        //     } else 
            
        //     if (!user && userFirst.user_first_access === true){
        //         throw new GoneException(`Senha de primeiro acesso inválida`);
        //     }
    
        //     if (!user && userFirst.user_password_status === false) {
        //         throw new NotFoundException(`Usuário bloqueado! Entre em contato com o Administrador.`);
        //     }
        // }

        return user;
    }

}