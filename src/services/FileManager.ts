import { createWriteStream, existsSync, mkdirSync, unlink } from "fs";
import { get } from "https";
import { resolve } from "path";
import { Service } from "typedi";
import { rootPath } from "../utils/asset";
import { moment } from "../utils/moment";

@Service()
export class FileManager {
  constructor() {}

  downloadFile(url: string, dir: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const file = createWriteStream(dir);
      const request = get(url, (res) => {
        if (res.statusCode !== 200) reject("response status error");

        res.pipe(file);
      });

      file.on("finish", () => {
        file.close(() => resolve(true));
      });

      request.on("error", (err) => {
        unlink(dir, () => reject(err.message));
        reject("request error");
      });

      file.on("error", (err) => {
        unlink(dir, () => reject(err.message));
      });
    });
  }

  getDir(fileName: string): string {
    const dir = resolve(rootPath, "static", "images");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    return resolve(dir, `${this.getCurrentDate()}-${fileName}`);
  }

  getCurrentDate(): string {
    return moment().valueOf().toString();
  }

  validateFileType(fileName: string): boolean {
    const reg = /(.*?)\.(jpg|jpeg|png|)$/;
    if (!fileName.match(reg)) return false;

    return true;
  }
}
