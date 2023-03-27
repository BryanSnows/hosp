import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity("USER")
export class UserEntity {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @Column()
    user_password: string;

    @Column()
    user_status: boolean;

    @Column()
    user_first_access: boolean;

    @Column()
    user_refresh_token: string;

    @Column()
    user_profile_id: number;

    @Column()
    user_enrollment: string;

    @Column()
    user_password_status: boolean;
    
}