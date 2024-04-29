import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleMenu } from './role-menu.entity';
import { RoleAuth } from './role-auth.entity';
import { Menu } from '../menu/menu.entity';
import { Auth } from './auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleMenu, Auth, RoleAuth, Menu])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
