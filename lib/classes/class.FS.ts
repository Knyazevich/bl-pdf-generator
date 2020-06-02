import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import Logger from './class.Logger';

class FS {
  public static createFile(filePath: string) {
    try {
      if (!fs.existsSync(filePath)) {
        fs.writeFile(filePath, null, (e) => {
          if (e) throw e;
        });
      }
    } catch (e) {
      const l = new Logger();
      l.log('error', e);

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
      const l = new Logger();
      l.log('error', e);

      if (e.code !== 'EEXIST') {
        throw e;
      }
    }
  }

  public static getTempDirectoryPath() {
    return path.join(os.tmpdir(), process.env.PREFIX);
  }

  public static createTempDirectory() {
    try {
      fs.mkdtemp(FS.getTempDirectoryPath(), (e, directory) => {
        if (e) throw e;
        return directory;
      });
    } catch (e) {
      const l = new Logger();
      l.log('error', e);
    }
  }

  public static removeDirectory(directory: string) {
    if (!fs.existsSync(directory)) {
      throw new Error(`${directory} does not exist`);
    }

    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const fileName = path.join(directory, file);
      const stat = fs.statSync(fileName);

      if (fileName === '.' || fileName === '..') {
        return;
      }

      if (stat.isDirectory()) {
        FS.removeDirectory(fileName);
      } else {
        fs.unlinkSync(fileName);
      }
    });

    fs.rmdirSync(directory);
  }

  public static copyDirectory(source: string, destination: string) {
    FS.createDirectory(destination);

    const files = fs.readdirSync(source);

    files.forEach((file) => {
      const current = fs.lstatSync(path.join(source, file));

      if (current.isDirectory()) {
        return FS.copyDirectory(path.join(source, file), path.join(destination, file));
      }

      if (current.isSymbolicLink()) {
        const symlink = fs.readlinkSync(path.join(source, file));
        fs.symlinkSync(symlink, path.join(destination, file));
      } else {
        fs.copyFile(path.join(source, file), path.join(destination, file), (err) => {
          if (err) throw err;
        });
      }
    });
  }

  public static copyFile(source: string, destination: string) {
    const oldFile = fs.createReadStream(source);
    const newFile = fs.createWriteStream(destination);

    oldFile.pipe(newFile);
  }

  public static move(source: string, destination: string) {
    const oldFile = fs.createReadStream(source);
    const newFile = fs.createWriteStream(destination);

    oldFile.pipe(newFile);
    oldFile.on('end', () => fs.unlinkSync(source));
  }

  public static pathExists(pathToTest: string) {
    return fs.existsSync(pathToTest);
  }
}

export default FS;
