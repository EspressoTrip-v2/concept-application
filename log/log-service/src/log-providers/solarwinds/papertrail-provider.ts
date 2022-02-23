import { AbstractLogger } from "../abstract-logger";
import winston from "winston";
import { Transports } from "winston/lib/winston/transports";
import { SyslogTransportInstance } from "winston-syslog";
import "winston-syslog";
import { LogCodes } from "@espressotrip-org/concept-common";

const winstonSys = winston.transports as Transports & { Syslog: SyslogTransportInstance };

export class PapertrailProvider extends AbstractLogger<winston.Logger> {
    private readonly m_papertrail: SyslogTransportInstance;

    constructor(logOrigin: string) {
        super();
        this.m_papertrail = new winstonSys.Syslog({
            host: process.env.PAPER_TRAIL_HOST,
            port: parseInt(process.env.PAPER_TRAIL_PORT!),
            protocol: "tls4",
            localhost: logOrigin,
            eol: "\n",
        });

        this.m_logger = winston.createLogger({
            format: winston.format.simple(),
            levels: winston.config.syslog.levels,
            transports: [this.m_papertrail],
        });
    }

    createLog(logData: Record<string, any>): void {
        switch (logData.logContext) {
            case LogCodes.CREATED:
            case LogCodes.UPDATED:
            case LogCodes.INFO:
                this.m_logger!.info(logData);
                break;
            case LogCodes.ERROR:
                this.m_logger!.error(logData);
                break;
            case LogCodes.DELETED:
                this.m_logger!.notice(logData);
                break;
            default:
                this.m_logger!.info(logData);
        }
    }
}
