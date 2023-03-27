
import { Module } from '@nestjs/common';
import { SwaggerModule } from './config/swagger/swagger.module';
import { ConfigModule } from './config/environments/config.module';
import { DatabaseModule } from './config/database/database.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SwaggerModule,
    ConfigModule,
    DatabaseModule,
    ProfileModule,
    UserModule
  ],

  providers: [ ]
})
export class AppModule { }
