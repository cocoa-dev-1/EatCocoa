import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Track } from "./Track";
import { User } from "./User";

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column("simple-array", { default: () => "('')" })
  order: number[];

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToMany(() => Track, (track) => track.playlist)
  @JoinTable()
  tracks: Track[];
}
