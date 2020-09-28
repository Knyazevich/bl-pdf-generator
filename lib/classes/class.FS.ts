import * as fs from 'fs';
import Logger from './class.Logger';

class FS {
  public static createFile(filePath: string, data?: any) {
    try {
      if (!fs.existsSync(filePath)) {
        fs.writeFile(filePath, data, (e) => {
          if (e) throw e;
        });
      }
    } catch (e) {
      Logger.log('error', `Error in FS.createFile(): ${e}`);

      if (e.code !== 'EEXIST') {
        throw e;
      }
    }
  }

  public static createDirectory(directoryPath: string) {
    try {
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }
    } catch (e) {
      Logger.log('error', `Error in FS.createDirectory(): ${e}`);

      if (e.code !== 'EEXIST') {
        throw e;
      }
    }
  }

  public static pathExists(pathToTest: string) {
    return fs.existsSync(pathToTest);
  }
}

export default FS;
