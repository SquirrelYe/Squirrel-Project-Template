/**
 * @description request 类型汇总
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.05 10:23:03
 */
export interface RequestOption {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data: Record<string, any>;
  header?: Record<string, any>;
  showLoading?: boolean;
  showLoadingDelay?: number;
}

export interface RequestResult {
  statusCode: number;
  data: Record<string, any>;
  errMsg: string;
  header: Record<string, any>;
}

export interface UploadFileOption {
  filePath: string;
  cloudPath: string;
  showLoading?: boolean;
  showLoadingDelay?: number;
}

export interface UploadFileResult {
  FileID: string;
  FilePath: string;
  ErrMsg: string;
}
