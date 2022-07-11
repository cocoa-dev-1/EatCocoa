import { Service } from "typedi";
import { Repository } from "typeorm";
import { SongDetail } from "../entities/SongDetail";
import { ECDataSource } from "../loader/typeormLoader";

@Service()
export class SongDetailManager {
  songDetailRepository: Repository<SongDetail>;
  constructor() {
    this.songDetailRepository = ECDataSource.getRepository(SongDetail);
  }

  async isExist(url: string): Promise<boolean> {
    const result = await this.songDetailRepository.findOne({
      where: {
        url: url,
      },
    });
    if (result) return true;
    else return false;
  }

  async create(name: string, url: string): Promise<SongDetail> {
    const songDetail = await this.songDetailRepository.create();
    songDetail.name = name;
    songDetail.url = url;
    const result = await this.songDetailRepository.save(songDetail);
    return result;
  }

  async get(url: string): Promise<SongDetail> {
    const result = await this.songDetailRepository.findOne({
      where: {
        url: url,
      },
    });
    return result;
  }
}
