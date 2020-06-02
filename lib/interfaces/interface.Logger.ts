interface ILogger {
  log(level: string, data: any, showStack?: boolean): void;
}
