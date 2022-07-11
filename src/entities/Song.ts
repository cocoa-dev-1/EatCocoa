import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlayList } from "./PlayList";
import { SongDetail } from "./SongDetail";

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PlayList, (playlist) => playlist.id, { onDelete: "CASCADE" })
  playList: PlayList;

  @Column()
  playListIndex: number;

  // @Column()
  // name: string;

  // @Column()
  // url: string;

  @ManyToOne(() => SongDetail, (songDetail) => songDetail.id, {
    onDelete: "CASCADE",
  })
  songDetail: SongDetail;
}
