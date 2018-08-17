export enum LogstashType {
  APIAccessLog = "accessLog",
  APIErrorLog = "errorLog",
  ClamAVLog = "clamLog",
  FreshclamLog = "freshClamLog",
  ClamAVErrorLog = "clamErrLog",
  FreshclamErrorLog = "freshClamErrLog"
}

export interface LogstashLoggable {
  write(obj: any, type: LogstashType, level: string);

  error(obj: any, type: LogstashType);

  info(obj: any, type: LogstashType);
}
