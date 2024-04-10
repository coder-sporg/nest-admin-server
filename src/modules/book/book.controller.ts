import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { QueryBookDto } from './types';
import { wrapperResponse } from '../../utils';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBookList(@Query() query: QueryBookDto) {
    return wrapperResponse(
      this.bookService.getBookList(query),
      '获取图书列表成功',
    );
  }
}
