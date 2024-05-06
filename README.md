# NestJS 开发企业级管理后台

## 代码结构
```bash
├── src # 项目源码
|  ├── exception # 异常处理
|  ├── modules # 模块源码
|  |  ├── auth # 登录模块
|  |  ├── book # 电子书模块
|  |  ├── menu # 菜单模块
|  |  └── user # 用户模块
|  └── utils # 工具方法
```

## 环境搭建和数据准备
### MySQL8 安装教程

- 安装教学：
[https://blog.csdn.net/rbx508780/article/details/127176754](https://blog.csdn.net/rbx508780/article/details/127176754)
- 官网下载：
[https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)

### SQL 脚本

- /sql/init.sql

- /sql/vben-book.postman_collection

    - postman 测试用例

### 电子书链接

- 解压后的电子书：
链接: https://pan.baidu.com/s/1kh_BS_oZS8GQMZkgplK_GA 提取码: 8p6d

### 其他注意事项

- 文件上传 需要 搭建 Nginx 环境

- 部署需要修改 `.env.production` 中的配置信息

- Docker 部署: `docker build -t admin-book:first .`
