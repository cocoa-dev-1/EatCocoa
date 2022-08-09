import { Service } from "typedi";
import { Repository } from "typeorm";
import { Track } from "../entities/Track";
import { ECDataSource } from "../loader/typeormLoader";

@Service()
export class TrackManager {
  trackRepository: Repository<Track>;
  constructor() {
    this.trackRepository = ECDataSource.getRepository(Track);
  }
}
