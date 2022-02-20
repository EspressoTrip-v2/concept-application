import { AbstractLogger } from "../abstract-logger";
import winston from "winston";
import { Loggly } from "winston-loggly-bulk";
import process from "process";

export class LogglyProvider extends AbstractLogger<winston.Logger> {

    createLog(logData: Record<string, any>): void {
        this.m_logger = winston.add(
            new Loggly({
                token: process.env.LOGGLY_TOKEN!,
                subdomain: process.env.LOGGLY_SUBDOMAIN!,
                tags: [logData.logContext, logData.service],
                json: true,
            })
        );
        this.m_logger.log("info", logData);
        this.m_logger.clear();
    }
}
