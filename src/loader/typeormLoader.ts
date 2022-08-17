import { DataSource, Db } from "typeorm";
import { db, DEV } from "../../config.json";
import { logger } from "../utils/logger";
import { winstonLogger } from "../utils/winston";
import path from "path";
import { Playlist } from "../entities/Playlist";
import { Track } from "../entities/Track";
import { User } from "discord.js";

export const ECDataSource = new DataSource({
  type: "mariadb",
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  entities: [Playlist, Track, User],
  synchronize: DEV ? true : false,
  logging: ["warn", "error"],
});

export const loadTypeorm = async () => {
  await ECDataSource.initialize()
    .then(() => {
      logger.success("Data Source has been initialized!");
    })
    .catch((err) => {
      winstonLogger.error(err);
      logger.error("Error during Data Source initialization");
    });
};
