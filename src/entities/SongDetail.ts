import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Song } from "./Song";

@Entity()
export class SongDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @OneToMany(() => Song, (song) => song.id, { onDelete: "CASCADE" })
  songs: Song[];
}
