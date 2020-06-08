import FS from './classes/class.FS';
import Logger from './classes/class.Logger';
import Server from './classes/class.Server';

require('dotenv').config();

class Main {
  public async run() {
    try {
      Main.createLogsDirectory();
      await new Server().run();
    } catch (e) {
      const l = new Logger();
      l.log('error', e);
    }
  }

  private static createLogsDirectory() {
    if (!FS.pathExists(process.env.LOG_FILE_PATH)) {
      FS.createDirectory(process.env.LOG_FOLDER_PATH);
      FS.createFile(process.env.LOG_FILE_PATH);
    }
  }
}

new Main().run();
