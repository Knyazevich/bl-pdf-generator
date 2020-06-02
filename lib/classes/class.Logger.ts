import * as fs from 'fs';

class Logger implements ILogger {
  public log(level: string, data: any, showStack?: boolean): void {
    if (process.env.NODE_ENV === 'test') return;

    const message = JSON.stringify(data);
    let colorCode = '';
    let fn = null;

    /* eslint-disable no-console */
    switch (level) {
      case 'good':
        colorCode = '\x1b[32m';
        fn = console.warn;
        break;
      case 'error':
        colorCode = '\x1b[31m';
        fn = console.warn;
        break;
      case 'info':
        colorCode = '\x1b[33m';
        fn = console.info;
        break;
      default:
        colorCode = '\x1b[33m';
        fn = console.error;
    }
    /* eslint-enable no-console */

    const date = new Date().toISOString();

    const error = `${colorCode} ${JSON.parse(message)}`;
    const errorWithStack = `${colorCode} ${level} : ${date} : ${message} \n ${new Error().stack} \n \n`;

    const stream = fs.createWriteStream(process.env.LOG_FILE_PATH, { flags: 'w+' });
    stream.write(errorWithStack);

    showStack ? fn(errorWithStack) : fn(error);
  }
}

export default Logger;
