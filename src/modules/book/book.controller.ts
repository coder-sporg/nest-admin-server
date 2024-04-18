import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service';
import { QueryBookDto } from './types';
import { wrapperCountResponse, wrapperResponse } from '../../utils';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBookList(@Query() query: QueryBookDto) {
    return wrapperCountResponse(
      this.bookService.getBookList(query),
      this.bookService.getBookCount(query),
      '获取图书列表成功',
    );
  }

  @Get(':id')
  getBook(@Param('id', ParseIntPipe) id) {
    return wrapperResponse(this.bookService.getBook(id), '查询电子书成功');
  }

  @Post('')
  addBook(@Body() body) {
    return wrapperResponse(this.bookService.addBook(body), '添加电子书成功');
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      // dest: 'uploads',
    }),
  )
  uploadBook(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /epub/, // 限制文件类型
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return wrapperResponse(this.bookService.uploadBook(file), '上传电子书成功');
  }
}
