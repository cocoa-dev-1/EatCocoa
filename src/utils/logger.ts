import chalk from "chalk";
import moment from "moment-timezone";

export const logger = {
  error(msg: string|null|undefined) {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    return console.log(`[${chalk.gray(date)}]: [${chalk.red("ERROR")}] ${msg}`);
  },
  log(msg: string|null|undefined) {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    return console.log(`[${chalk.gray(date)}]: [${chalk.blue("LOG")}] ${msg}`);
  },
  success(msg: string|null|undefined) {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    return console.log(`[${chalk.gray(date)}]: [${chalk.green("SUCCESS")}] ${msg}`);
  }
}