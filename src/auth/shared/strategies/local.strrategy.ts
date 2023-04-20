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

        if (!user) {
            throw new UnauthorizedException(`Password is wrong`)
        }

        return user;
    }

}