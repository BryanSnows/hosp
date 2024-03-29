import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './shared/auth.service';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './shared/guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './shared/guards/local-auth.guard';

@ApiTags('Login')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }


    @Post('/login')
    @PublicRoute()
    @UseGuards(LocalAuthGuard)
    async auth(@Body() auth: LoginDTO) {
        return this.authService.login(auth);
    }

    @Post('/logout')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async logout(@Request() payload: any) {
        return this.authService.removeRefreshToken(payload.user.sub);
    }

    @Post('/refresh_token')
    @ApiBearerAuth()
    @PublicRoute()
    @UseGuards(JwtRefreshAuthGuard)
    async refreshToken(@Request() payload: any) {
        return this.authService.refreshToken(payload.user_enrollment, payload.user_refresh_token);
    }

    // @Post('/first_access')
    // @ApiBearerAuth()
    // @PublicRoute()
    // @UseGuards(JwtFirstAccessAuthGuard)
    // async firstAccess(@Request() payload: any, @Body() firstAccessDto: FirstAccessDto) {
    //     return this.authService.firstAccess(payload.user.enrollment, firstAccessDto);
    // }

    
}
