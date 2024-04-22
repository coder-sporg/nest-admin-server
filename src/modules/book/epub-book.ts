import * as os from 'os';
import * as path from 'path';
import * as fse from 'fs-extra'; // fs-extra 是原生 fs 的替代品。中 fs 的所有方法都附加到 fs-extra
import {
  copyCoverImage,
  copyUnzipBook,
  parseContentOpf,
  parseRootFile,
  unzip,
} from './epub-parse';

const TEMP_PATH = '.vben/tmp-book';

class EpubBook {
  private bookPath: string;
  private file: Express.Multer.File;
  private fileName: string;
  private size: number;

  constructor(bookPath: string, file: Express.Multer.File) {
    this.bookPath = bookPath;
    this.file = file;
    this.fileName = file.originalname;
    this.size = file.size;
  }

  async parse() {
    // console.log('电子书解析', this.bookPath, this.file); // 当前上传文件的路径和内容
    // 1.生成临时文件
    const homeDir = os.homedir(); // C:\Users\ca
    const tmpDir = path.resolve(homeDir, TEMP_PATH);
    const tmpFile = path.resolve(tmpDir, this.fileName);
    fse.copySync(this.bookPath, tmpFile); // 拷贝电子书 => 源文件路径，目标文件路径
    // 2.epub电子书解压
    // 2.1 解压后电子书存放目录
    const tmpUnzipDirName = this.fileName.replace('.epub', ''); // 123.epub => 123
    const tmpUnzipDir = path.resolve(tmpDir, tmpUnzipDirName);
    // 2.2 解压
    fse.mkdirpSync(tmpUnzipDir); // 创建目录, mkdirpSync 会将路径上不存在的目录都创建出来
    unzip(tmpFile, tmpUnzipDir);
    // 3.epub root file 解析
    const rootFile = await parseRootFile(tmpUnzipDir); // 得到的是 一个路径
    // 4.epub content opf 解析
    const bookData = await parseContentOpf(
      tmpUnzipDir,
      rootFile,
      this.fileName,
    );
    // console.log('bookData: ', bookData);
    // 5.拷贝电子书封面图片
    const cover = copyCoverImage(bookData, tmpDir);
    // console.log('cover: ', cover);
    bookData.cover = cover.replaceAll('\\', '/'); // 对路径进行处理，将反斜杠替换为斜杠
    // 6.拷贝解压后电子书
    copyUnzipBook(tmpUnzipDir, tmpUnzipDirName);
    // 7.删除临时文件
    fse.removeSync(tmpFile);
    fse.removeSync(tmpUnzipDir);
    return bookData;
  }
}

export default EpubBook;
