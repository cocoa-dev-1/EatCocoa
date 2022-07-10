import { Service } from "typedi";
import { Repository } from "typeorm";
import { Song } from "../entities/Song";
import { ECDataSource } from "../loader/typeormLoader";

@Service()
export class SongManager {
  private songRepository: Repository<Song>;
  constructor() {
    this.songRepository = ECDataSource.getRepository(Song);
  }

  async isExist(url: string) {
    const result = await this.songRepository.findOne({
      where: {
        url: url,
      },
    });
    if (result) return true;
    else return false;
  }

  async create(name: string, url: string) {
    const song = this.songRepository.create();
    song.name = name;
    song.url = url;
    const { ...result } = await this.songRepository.save(song);
    return result;
  }

  async get(url: string) {
    const result = await this.songRepository.findOne({
      where: {
        url: url,
      },
    });
    return result;
  }
}
