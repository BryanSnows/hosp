
import { Module } from '@nestjs/common';
import { SwaggerModule } from './config/swagger/swagger.module';
import { ConfigModule } from './config/environments/config.module';
import { DatabaseModule } from './config/database/database.module';

@Module({
  imports: [
    SwaggerModule,
    ConfigModule,
    DatabaseModule,
  ],

  providers: [ ]
})
export class AppModule { }
