import { AbstractLogger } from "../abstract-logger";
import winston from "winston";
import { Loggly } from "winston-loggly-bulk";
import process from "process";
import { LogCodes } from "@espressotrip-org/concept-common";

export class LogglyProvider extends AbstractLogger<winston.Logger> {
    createLog(logData: Record<string, any>): void {
        this.m_logger = winston.add(
            new Loggly({
                token: process.env.LOGGLY_TOKEN!,
                subdomain: process.env.LOGGLY_SUBDOMAIN!,
                tags: [logData.logContext, logData.service],
                json: true,
            }),
        );
        switch (logData.logContext) {
            case LogCodes.CREATED:
            case LogCodes.UPDATED:
            case LogCodes.INFO:
                this.m_logger.log("info", logData);
                break;
            case LogCodes.ERROR:
                this.m_logger.log("error", logData);
                break;
            case LogCodes.DELETED:
                this.m_logger.log("notice", logData);
                break;
            default:
                this.m_logger.log("info", logData);
        }
        this.m_logger.clear();
    }
}
