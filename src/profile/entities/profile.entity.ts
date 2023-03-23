import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('PROFILE')
export class ProfileEntity {

  @PrimaryGeneratedColumn()
  profile_id: number;

  @Column()
  profile_name: string;


}