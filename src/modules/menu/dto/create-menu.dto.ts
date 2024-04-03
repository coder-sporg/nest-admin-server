export class CreateMenuDto {
  path: string;
  name: string;
  redirect?: string;
  meta?: string;
  pid?: number;
  active?: number;
}
