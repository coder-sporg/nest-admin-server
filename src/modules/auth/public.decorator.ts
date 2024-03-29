import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// 提供一个将路由声明为公共路由的机制 防止 AuthGuard 拦截公共路由
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
