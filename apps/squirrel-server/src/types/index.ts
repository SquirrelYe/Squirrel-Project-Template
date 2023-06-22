/**
 * @description index.ts 入口文件，用于导出所有类型定义文件，方便其他文件导入使用
 * @author willye
 * @time 2023.06.21 22:40:55
 */

export type ServiceReturnType<T> = Promise<[Error | null, T]>;
