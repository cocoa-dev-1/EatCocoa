import { TrackData } from "erela.js";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { Track } from "../entities/Track";
import { Track as LaTrack } from "erela.js";
import { ECDataSource } from "../loader/typeormLoader";
import { APIInteractionGuildMember, GuildMember } from "discord.js";
import { manager } from "../loader/managerLoader";

@Service()
export class TrackManager {
  trackRepository: Repository<Track>;
  constructor() {
    this.trackRepository = ECDataSource.getRepository(Track);
  }

  async get(url: string): Promise<Track | null> {
    const result = await this.trackRepository.findOne({
      where: {
        url: url,
      },
    });
    if (result) return result;
    else return null;
  }

  async create(track: LaTrack): Promise<Track | null> {
    let result = await this.get(track.uri);
    if (!result) {
      const newTrack = this.trackRepository.create();
      newTrack.name = track.title;
      newTrack.url = track.uri;
      result = await this.trackRepository.save(newTrack);
      return result;
    } else {
      return result;
    }
  }

  async getTrackById(id: number): Promise<Track> {
    const result = await this.trackRepository.findOne({
      where: {
        id: id,
      },
    });
    return result;
  }

  async toLaTrack(
    track: Track,
    requester: GuildMember | APIInteractionGuildMember
  ): Promise<LaTrack | null> {
    const result = await manager.search(track.url, requester);
    if (
      result.loadType == "SEARCH_RESULT" ||
      result.loadType === "TRACK_LOADED"
    ) {
      return result.tracks[0];
    } else {
      return null;
    }
  }
}
