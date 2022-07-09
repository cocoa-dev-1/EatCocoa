import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class PlayList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
