import {
  Column,
  Entity,
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

  @Column()
  order: number[];

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToMany(() => Track, (track) => track.id)
  tracks: Track[];
}
