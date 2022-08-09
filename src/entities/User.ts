import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Playlist } from "./Playlist";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  tag: string;

  @Column({ unique: true })
  discordId: string;

  @OneToMany(() => Playlist, (playlist) => playlist.id)
  playlists: Playlist[];
}
