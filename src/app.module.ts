import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    SwaggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
