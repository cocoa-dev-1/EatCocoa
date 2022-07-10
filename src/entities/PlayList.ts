import { User } from "discord.js";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Song } from "./Song";

@Entity()
export class PlayList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  creator: string;

  @OneToMany(() => Song, (song) => song.id)
  songs: Song[];
}
