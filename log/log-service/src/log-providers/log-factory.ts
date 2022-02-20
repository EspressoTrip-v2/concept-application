import { LogClass, LogglyProvider, LogProviderTypes, PapertrailProvider } from "./solarwinds";

/**
 * The log provider type needs to be set in the environment variable (LOG_PROVIDER_TYPE).
 * The variable needs to match one of the LogProviderTypes in interface.ts
 */
export class LogFactory {
    static getLogger(logType: LogProviderTypes): LogClass {
        switch (logType) {
            case LogProviderTypes.loggly:
                return new LogglyProvider();
            case LogProviderTypes.papertrail:
                return new PapertrailProvider();
            default:
                throw new Error("No matching log provider found.");
        }
    }
}
