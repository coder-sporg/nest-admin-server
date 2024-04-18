import * as path from 'path';
import * as fse from 'fs-extra'; // 可以替代 fs 使用
import * as AdmZip from 'adm-zip'; // 纯 js 实现 zip 解压
import * as XmlJS from 'xml2js';
import { NGINX_PATH } from '../../utils/const';

// 解压 zip 文件
export function unzip(bookPath: string, unzipPath: string) {
  const zip = new AdmZip(bookPath);
  zip.extractAllTo(unzipPath, true); // 覆盖式解压
}

export function parseRootFile(unzipPath: string) {
  const containerFilePath = path.resolve(unzipPath, 'META-INF/container.xml');
  const containerXML = fse.readFileSync(containerFilePath, 'utf-8');
  const { parseStringPromise } = XmlJS;
  return parseStringPromise(containerXML, {
    explicitArray: false, // 不会将同一类型的元素解析为数组，而是将它们解析为对象
  }).then((data: any) => {
    // console.log('data: ', data.container.rootfiles);
    // $ 表示属性
    return data.container.rootfiles.rootfile['$']['full-path'];
  });
}

export function parseContentOpf(
  unzipPath: string,
  rootFilePath: string,
  fileName: string,
) {
  // 获取 content.opf 路径
  const fullPath = path.resolve(unzipPath, rootFilePath);
  const contentOpf = fse.readFileSync(fullPath, 'utf-8');
  // console.log('contentOpf: ', contentOpf);
  const { parseStringPromise } = XmlJS;
  return parseStringPromise(contentOpf, {
    explicitArray: false, // 不会将同一类型的元素解析为数组，而是将它们解析为对象
  }).then(async (data: any) => {
    const { metadata } = data.package;
    // console.log('metadata: ', metadata); // 电子书的相关信息
    const title = metadata['dc:title']; // 书名
    const author = metadata['dc:creator']; // 作者
    const language = metadata['dc:language']; // 语种
    const publisher = metadata['dc:publisher']; // 出版社
    let coverMeta: any = {};
    // 判断 metadata.meta 是否是数组
    if (Array.isArray(metadata.meta)) {
      coverMeta =
        metadata.meta.find((meta: any) => meta['$'].name === 'cover') ?? {}; // 封面
    } else {
      coverMeta = metadata.meta['$'].name === 'cover' ? metadata.meta : {};
    }
    const coverId = coverMeta['$']?.content; // 封面图片的 id
    const manifest = data.package.manifest.item; // 所有的资源
    const coverRes = manifest.find((m) => m['$'].id === coverId) ?? {};
    const dir = path.dirname(fullPath); // 获取路径的目录名
    const cover = coverRes['$']?.href
      ? path.resolve(dir, coverRes['$'].href)
      : '';

    console.log(`电子书信息:
        书名：${title}
        作者：${author}
        语种：${language}
        出版社：${publisher}
        封面：${cover}
    `);

    const rootDir = path.dirname(rootFilePath); // 获取跟文件路径的目录名
    const content = await parseContent(dir, 'toc.ncx', rootDir, fileName);
    // console.log('content: ', content);

    return {
      title,
      author,
      language,
      publisher,
      cover,
      content,
      rootFile: rootFilePath,
    };
  });
}

export async function parseContent(
  contentDir: string,
  contentFilePath: string,
  rootDir: string,
  fileName: string,
) {
  const contentPath = path.resolve(contentDir, contentFilePath);
  const contentXml = fse.readFileSync(contentPath, 'utf-8');
  const { parseStringPromise } = XmlJS;
  const data = await parseStringPromise(contentXml, { explicitArray: false });
  const navMap = data.ncx.navMap.navPoint;
  const fileNameWithoutSuffix = fileName.replace('.epub', '');
  // console.log(navMap);
  const navData = navMap.map((nav) => {
    const id = nav['$'].id;
    const playOrder = +nav['$'].playOrder;
    const text = nav.navLabel.text;
    const href = nav.content['$'].src;
    return {
      id,
      playOrder,
      text,
      href: `${fileNameWithoutSuffix}/${rootDir}/${href}`,
    };
  });
  return navData;
}

export function copyCoverImage(data, tmpDir: string) {
  const { cover } = data;
  if (!cover) {
    return;
  }
  const coverPathname = cover.replace(tmpDir + '\\', ''); // Windows 系统 路径：\ => 反斜线 需要转义
  const coverDir = path.resolve(NGINX_PATH, 'cover');
  const coverNewPath = path.resolve(coverDir, coverPathname);
  fse.mkdirpSync(coverDir);
  fse.copySync(cover, coverNewPath);
  return coverPathname;
}

export function copyUnzipBook(tmpDir, dirName) {
  const bookDir = path.resolve(NGINX_PATH, 'book', dirName);
  fse.mkdirpSync(bookDir);
  fse.copySync(tmpDir, bookDir);
}
