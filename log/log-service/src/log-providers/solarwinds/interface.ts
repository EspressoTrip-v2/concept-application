import { LogglyProvider } from "./loggly-provider";
import { PapertrailProvider } from "./papertrail-provider";

export enum LogProviderTypes {
    loggly = "loggly",
    papertrail = "papertrail"
}

/**
 * Class types for log provider
 */
export type LogClass = LogglyProvider | PapertrailProvider
