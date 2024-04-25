import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { MenuModule } from './modules/menu/menu.module';
import { RoleModule } from './modules/role/role.module';
import { ContentsModule } from './modules/contents/contents.module';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => dotenv.config({ path: '.env' })], // 加载.env文件 允许加载多个配置文件 [自定义配置文件]
      envFilePath: envFilePath, // 会覆盖 load 中的同名配置文件
      // envFilePath: ['.env', '.env.development'], // 在多个文件中发现同一个变量，则第一个变量优先
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        // 验证.env文件中的变量是否符合要求
        // 对数据库类型做校验
        DB_TYPE: Joi.string().valid('mysql', 'postgres', 'mongodb'),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        DB_PORT: Joi.number().default(3306).valid(3306, 3307, 3308),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
      }),
    }),
    // TypeOrmModule.forRoot() // 将配置写死，同步
    // 异步传递模块 config
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // 同步本地的schema与数据库 => 初始化的时候使用
          // synchronize: configService.get(ConfigEnum.DB_SYNC),
          logging: true,
          autoLoadEntities: true,
        }) as TypeOrmModuleOptions,
    }),
    UserModule,
    AuthModule,
    BookModule,
    MenuModule,
    ContentsModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
