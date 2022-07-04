import { Service } from "typedi";
import ytpl from "ytpl";
import ytdl from "ytdl-core";
import ytsr from "ytsr";

@Service()
export class YtManager {
  constructor() {}

  async getVideo() {}

  validate(url: string): boolean {
    return ytdl.validateURL(url);
  }
}
