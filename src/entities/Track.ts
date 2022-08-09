import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Playlist } from "./Playlist";

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  url: string;

  @ManyToMany(() => Playlist, (playlist) => playlist.id)
  playlist: Playlist[];
}
