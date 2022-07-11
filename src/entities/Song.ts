import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlayList } from "./PlayList";

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PlayList, (playlist) => playlist.id, { onDelete: "CASCADE" })
  playListName: PlayList;

  @Column()
  name: string;

  @Column({ unique: true })
  url: string;
}
