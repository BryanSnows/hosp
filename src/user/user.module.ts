import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ProfileEntity } from "src/access-control/entities/profile.entity";



@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ProfileEntity])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports:[UserService]
})

export class UserModule {}