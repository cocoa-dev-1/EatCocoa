import { DataSource, Db } from "typeorm";
import { db } from "../../config.json";
import { logger } from "../utils/logger";
import { winstonLogger } from "../utils/winston";

export const EatCocoaDataSource = new DataSource({
  type: "mysql",
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
});

EatCocoaDataSource.initialize()
  .then(() => {
    logger.success("Data Source has been initialized!");
  })
  .catch((err) => {
    winstonLogger.error(err);
    logger.error("Error during Data Source initialization");
  });