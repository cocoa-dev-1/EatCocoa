import { createLogger, format } from "winston";
import winstonDaily from "winston-daily-rotate-file";

const logDir = "logs";
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  }
);

const winstonLogger = createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }), 
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 30,  // 30일치 로그 파일 저장
      zippedArchive: true, 
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',  // error.log 파일은 /logs/error 하위에 저장 
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    })
  ]
})

export {
  winstonLogger
}