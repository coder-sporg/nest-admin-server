import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { RoleMenu } from './role-menu.entity';
import { Menu } from '../menu/menu.entity';
import { RoleAuth } from './role-auth.entity';
import { Auth } from './auth.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(RoleMenu)
    private roleMenuRepository: Repository<RoleMenu>,
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    @InjectRepository(RoleAuth)
    private roleAuthRepository: Repository<RoleAuth>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    // 删除 菜单中角色 和 角色菜单关系
    await this.removeRoleMenu(id);
    // 删除 角色权限关系
    await this.removeRoleAuth(id);
    return this.roleRepository.delete(id);
  }

  /**
   * 角色-菜单关系处理
   */
  findRoleMenu(id: number) {
    return this.roleMenuRepository.find({
      where: {
        roleId: id,
      },
    });
  }

  // 移除菜单角色
  async removeRoleMenu(roleId: number) {
    // 查询当前角色
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    // 查询当前角色的菜单
    const menuList = await this.findRoleMenu(roleId);
    const menuIdList = menuList.map((item) => item.menuId);

    // 删除菜单 meta 中的角色
    for (const menuId of menuIdList) {
      const menu = await this.menuRepository.findOne({
        where: { id: menuId },
      });
      if (menu) {
        const meta = JSON.parse(menu.meta);
        if (meta.roles && meta.roles.length > 0) {
          if (meta.roles.includes(role.name)) {
            meta.roles = meta.roles.filter((item) => item !== role.name);
          }
        }
        menu.meta = JSON.stringify(meta);
        // 更新菜单
        this.menuRepository.update(menuId, menu);
      }
    }
    return this.roleMenuRepository.delete({ roleId });
  }

  // 设置角色菜单
  async setRoleMenu(roleId: number, menuId: number) {
    const roleMenu = new RoleMenu();
    roleMenu.roleId = roleId;
    roleMenu.menuId = menuId;

    // 查询当前角色
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    // TODO: 更新菜单中的 meta数据
    const menu = await this.menuRepository.findOne({
      where: { id: menuId },
    });
    if (menu) {
      const meta = JSON.parse(menu.meta);
      if (meta.roles && meta.roles.length > 0) {
        if (!meta.roles.includes(role.name)) {
          meta.roles.push(role.name);
        }
      } else {
        // 没有角色就将当前角色赋值
        meta.roles = [role.name];
      }
      menu.meta = JSON.stringify(meta);
      this.menuRepository.update(menuId, menu);
    }
    return this.roleMenuRepository.save(roleMenu);
  }

  /**
   * 角色-权限关系
   */
  getAuthList(key: string) {
    // return this.authRepository.find({
    //   where: {
    //     key,
    //   },
    // });
    if (key) {
      // 模糊查询
      return this.authRepository
        .createQueryBuilder('auth')
        .where('auth.key like :key', { key: `%${key}%` })
        .getMany();
    }
    return this.authRepository.find();
  }

  createAuth(createAuthDto) {
    return this.authRepository.save(createAuthDto);
  }

  async removeAuth(id: number) {
    // 删除角色_权限表中的权限
    await this.roleAuthRepository.delete({ authId: id });
    return this.authRepository.delete(id);
  }

  async updateAuth(id: number, createAuthDto) {
    const auth = await this.authRepository.findOne({
      where: {
        id,
      },
    });
    if (auth) {
      return this.authRepository.save({
        ...auth,
        ...createAuthDto,
      });
    }
  }

  findRoleAuth(roleId: number) {
    return this.roleAuthRepository.find({
      where: {
        roleId,
      },
    });
  }

  // 移除角色权限
  async removeRoleAuth(roleId: number) {
    return this.roleAuthRepository.delete({ roleId });
  }

  // 设置角色权限
  async setRoleAuth(roleId: number, authId: number) {
    const roleAuth = new RoleAuth();
    roleAuth.roleId = roleId;
    roleAuth.authId = authId;
    return this.roleAuthRepository.save(roleAuth);
  }
}
