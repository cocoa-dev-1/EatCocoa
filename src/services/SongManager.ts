import { PlayList } from "../entities/PlayList";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { Song } from "../entities/Song";
import { ECDataSource } from "../loader/typeormLoader";
import { SongDetail } from "../entities/SongDetail";

@Service()
export class SongManager {
  private songRepository: Repository<Song>;
  constructor() {
    this.songRepository = ECDataSource.getRepository(Song);
  }

  async isExist(url: string): Promise<boolean> {
    const result = await this.songRepository.findOne({
      where: {
        songDetail: {
          url: url,
        },
      },
    });
    if (result) return true;
    else return false;
  }

  async create(songDetail: SongDetail, playlist: PlayList): Promise<Song> {
    const index = await this.getPlayListIndex(playlist);
    const song = this.songRepository.create();
    song.playList = playlist;
    song.songDetail = songDetail;
    song.playListIndex = index;
    const result = await this.songRepository.save(song);
    return result;
  }

  async get(url: string): Promise<Song> {
    const result = await this.songRepository.findOne({
      where: {
        songDetail: {
          url: url,
        },
      },
    });
    return result;
  }

  async getPlayListIndex(playlist: PlayList): Promise<number> {
    const result = await this.songRepository.find({
      where: {
        playList: playlist,
      },
    });
    return result?.length || 0;
  }
}
