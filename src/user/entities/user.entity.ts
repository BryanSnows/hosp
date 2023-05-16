
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { BitToBooleanTransformer } from '../../config/database/transformers/bit-to-boolean.transformer';
import { ProfileEntity } from "./profile.entity";
@Entity("USER")
export class UserEntity {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @Column()
    user_password: string;

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })

    user_status: boolean;

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })

    user_first_access: boolean;

    @Column()
    user_refresh_token: string;

    @Column()
    user_profile_id: number;

    @Column()
    user_enrollment: string;

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })
    user_password_status: boolean;

    @ManyToOne(() => ProfileEntity, (profile) => profile.users)
    @JoinColumn({ name: 'user_profile_id' })
    profile: ProfileEntity


    
}