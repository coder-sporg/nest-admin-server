import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { QueryBookDto } from './types';
import { wrapperCountResponse } from '../../utils';

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
}
