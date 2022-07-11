import { DataSource, Db } from "typeorm";
import { db, DEV } from "../../config.json";
import { PlayList } from "../entities/PlayList";
import { Song } from "../entities/Song";
import { logger } from "../utils/logger";
import { winstonLogger } from "../utils/winston";
import path from "path";
import { SongDetail } from "../entities/SongDetail";

export const ECDataSource = new DataSource({
  type: "mariadb",
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  entities: [PlayList, Song, SongDetail],
  migrations: [path.resolve(__dirname, "src/migration") + "/*.ts"],
  migrationsTableName: "migration",
  synchronize: DEV ? true : false,
  logging: ["warn", "error"],
});

export const loadTypeorm = async () => {
  ECDataSource.initialize()
    .then(() => {
      logger.success("Data Source has been initialized!");
    })
    .catch((err) => {
      winstonLogger.error(err);
      logger.error("Error during Data Source initialization");
    });
};
