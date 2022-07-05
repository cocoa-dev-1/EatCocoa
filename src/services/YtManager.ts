import { Service } from "typedi";
import ytpl, { Item, Result } from "ytpl";
import ytdl from "ytdl-core";
import ytsr, { Item as SrItem, Video } from "ytsr";
import { PlayerItem } from "../types/player";

@Service()
export class YtManager {
  constructor() {}

  validate(url: string): boolean {
    return ytdl.validateURL(url);
  }
  listCheck(url: string): boolean {
    if (url.includes("list=")) {
      return true;
    } else {
      return false;
    }
  }
  async getPlayList(url: string): Promise<Result> {
    const playlist = await ytpl(url.split("list=")[1]);
    return playlist;
  }

  async getVideoInfo(url: string) {
    return await ytdl.getBasicInfo(url);
  }

  async search(url: string): Promise<SrItem[]> {
    const searchResult = await ytsr(url, { limit: 10 });
    return searchResult.items;
  }
}
