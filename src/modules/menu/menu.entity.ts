import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'menu' })
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  @Unique(['name'])
  name: string;

  @Column()
  redirect: string;

  @Column()
  meta: string;

  @Column({ default: 0 })
  pid: number;

  // 是否激活 0 禁用 1 激活
  @Column({ default: 1 })
  active: number;
}
