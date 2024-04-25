import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('role_auth')
export class RoleAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['key'])
  key: string;

  @Column()
  name: string;

  @Column()
  remark: string;
}
