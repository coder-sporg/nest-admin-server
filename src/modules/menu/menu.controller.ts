import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { wrapperResponse } from '../../utils';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    console.log('createMenuDto: ', createMenuDto);
    return wrapperResponse(
      this.menuService.create(createMenuDto),
      '创建菜单成功',
    );
  }

  @Get('active')
  findActiveMenu() {
    return wrapperResponse(
      this.menuService.findAllActive(),
      '获取激活菜单列表成功',
    );
  }

  @Get()
  findAllMenu() {
    return wrapperResponse(this.menuService.findAll(), '获取所有菜单列表成功');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return wrapperResponse(
      this.menuService.update(+id, updateMenuDto),
      '编辑菜单成功',
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
