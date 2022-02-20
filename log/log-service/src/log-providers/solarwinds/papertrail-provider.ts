import { AbstractLogger } from "../abstract-logger";
import winston from "winston";

export class PapertrailProvider extends AbstractLogger<winston.Logger> {
    createLog(logData: Record<string, any>): void {}
}
