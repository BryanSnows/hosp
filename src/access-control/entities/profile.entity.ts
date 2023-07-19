import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TransactionEntity } from "./transaction.entity";
import { UserEntity } from "src/user/entities/user.entity";



@Entity('PROFILE')
export class ProfileEntity {

    @PrimaryGeneratedColumn()
    profile_id: number

    @Column()
    profile_name: string

    @OneToMany(() => UserEntity, (user) => user.profile)
    users: UserEntity[];

    @ManyToMany(() => TransactionEntity, { eager: true })
    @JoinTable({
        name: 'PROFILE_TRANSACTION',
        joinColumn: {
            name: 'profile_id',
            referencedColumnName: 'profile_id'
        },
        inverseJoinColumn: {
            name: 'transaction_id',
            referencedColumnName: 'transaction_id'
        }
    })
    transactions?: TransactionEntity[];
}