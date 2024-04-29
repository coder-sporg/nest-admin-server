import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { wrapperResponse } from '../../utils';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('menu')
  setRoleMenu(@Body() params: { roleId: number; menuId: number }) {
    return wrapperResponse(
      this.roleService.setRoleMenu(params.roleId, params.menuId),
      '角色与菜单关联成功',
    );
  }

  @Get(':id/menu')
  findRoleMenu(@Param('id') id: string) {
    // 获取角色菜单
    return wrapperResponse(
      this.roleService.findRoleMenu(+id),
      '获取角色菜单成功',
    );
  }

  @Delete('menu')
  removeRoleMenu(@Body('roleId') roleId: number) {
    return wrapperResponse(
      this.roleService.removeRoleMenu(roleId),
      '角色与菜单关联删除成功',
    );
  }

  @Get('auth')
  getAuthList(@Query('key') key) {
    return wrapperResponse(
      this.roleService.getAuthList(key),
      '获取权限列表成功',
    );
  }

  @Post('auth')
  createAuth(@Body() params) {
    return wrapperResponse(this.roleService.createAuth(params), '新建权限成功');
  }

  @Patch('auth/:id')
  updateAuth(@Param('id') id: string, @Body() params) {
    return wrapperResponse(
      this.roleService.updateAuth(+id, params),
      '更新权限成功',
    );
  }

  @Delete('auth/:id')
  removeAuth(@Param('id') id: string) {
    return wrapperResponse(this.roleService.removeAuth(+id), '删除权限成功');
  }

  @Post('role_auth')
  setRoleAuth(@Body() params: { roleId: number; authId: number }) {
    return wrapperResponse(
      this.roleService.setRoleAuth(params.roleId, params.authId),
      '角色与权限关联成功',
    );
  }

  @Get(':id/role_auth')
  findRoleAuth(@Param('id') id: string) {
    // 获取角色菜单
    return wrapperResponse(
      this.roleService.findRoleAuth(+id),
      '获取角色权限成功',
    );
  }

  @Delete('role_auth')
  removeRoleAuth(@Body('roleId') roleId: number) {
    return wrapperResponse(
      this.roleService.removeRoleAuth(roleId),
      '角色与权限关联删除成功',
    );
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return wrapperResponse(
      this.roleService.create(createRoleDto),
      '创建角色成功',
    );
  }

  @Get()
  findAll() {
    return wrapperResponse(this.roleService.findAll(), '获取角色列表成功');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return wrapperResponse(
      this.roleService.update(+id, updateRoleDto),
      '更新角色成功',
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return wrapperResponse(this.roleService.remove(+id), '删除角色成功');
  }
}
