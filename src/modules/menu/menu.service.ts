import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
// import { MENU_LIST } from './menu.data';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    if (!createMenuDto.redirect) {
      createMenuDto.redirect = '';
    }
    if (!createMenuDto.meta) {
      createMenuDto.meta = '';
    }
    const newMenu = await this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(newMenu);
  }

  findAll() {
    return this.menuRepository.find();
    // return Promise.resolve(MENU_LIST);
  }

  findAllActive() {
    return this.menuRepository.findBy({ active: 1 });
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) throw new HttpException('id 不存在', HttpStatus.BAD_REQUEST);
    return this.menuRepository.update(id, updateMenuDto);
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
