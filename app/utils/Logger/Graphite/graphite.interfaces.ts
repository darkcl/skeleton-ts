export interface GraphiteLoggable {
  write(obj: any, cb: any);
  end();
}
