
import { Module } from '@nestjs/common';
import { SwaggerModule } from './config/swagger/swagger.module';
import { ConfigModule } from './config/environments/config.module';
import { DatabaseModule } from './config/database/database.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/shared/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    SwaggerModule,
    ConfigModule,
    DatabaseModule,
    UserModule
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ]
})
export class AppModule { }
