import { Controller, Post, Body, Delete, Get, Query } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { wrapperResponse } from 'src/utils';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get('/fileName')
  findAll(@Query('fileName') fileName: string) {
    return wrapperResponse(
      this.contentsService.findContentsByFileName(fileName),
      '获取电子书目录成功',
    );
  }

  @Post()
  create(@Body() createContentDto) {
    return wrapperResponse(
      this.contentsService.create(createContentDto),
      '电子书新增目录成功',
    );
  }

  @Delete()
  remove(@Body('fileName') fileName: string) {
    // 删除当前名称的 所有目录内容
    return wrapperResponse(
      this.contentsService.remove(fileName),
      '删除电子书目录成功',
    );
  }
}
