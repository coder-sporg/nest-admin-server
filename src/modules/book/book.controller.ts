import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
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

  @Get('/category')
  getBookCategory(@Req() req: any) {
    return wrapperResponse(
      this.bookService.getBookCategory(req.user.userid),
      '获取图书分类成功',
    );
  }

  @Get()
  getBookList(@Query() query: QueryBookDto, @Req() req: any) {
    const {
      user: { userid },
    } = req;
    return wrapperCountResponse(
      this.bookService.getBookList(query, userid),
      this.bookService.getBookCount(query, userid),
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

  @Put(':id')
  updateBook(@Param('id', ParseIntPipe) id, @Body() body) {
    return wrapperResponse(
      this.bookService.updateBook(id, body),
      '更新电子书成功',
    );
  }

  @Delete(':id')
  deleteBook(@Param('id', ParseIntPipe) id) {
    return wrapperResponse(this.bookService.deleteBook(id), '删除电子书成功');
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
