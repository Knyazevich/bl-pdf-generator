import FS from './classes/class.FS';
import Logger from './classes/class.Logger';
import Server from './classes/class.Server';
import Redis from './classes/class.Redis';

require('dotenv').config();

class Main {
  public async run() {
    try {
      Redis.createInstance();
      Main.createLogsDirectory();

      new Server();
    } catch (e) {
      Logger.log('error', `Error while initializing on the high level method: ${e}`);
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
