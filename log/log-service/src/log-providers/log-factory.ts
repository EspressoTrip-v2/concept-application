import { LogClass, LogglyProvider, LogProviderTypes, PapertrailProvider } from "./solarwinds";

/**
 * The log provider type needs to be set in the environment variable (LOG_PROVIDER_TYPE).
 * The variable needs to match one of the LogProviderTypes in interface.ts
 */
export class LogFactory {
    static getLogger(logType: LogProviderTypes, logOrigin: string): LogClass {
        switch (logType) {
            case LogProviderTypes.loggly:
                if (!process.env.LOGGLY_TOKEN) throw new Error("LOGGLY_TOKEN must be defined");
                if (!process.env.LOGGLY_SUBDOMAIN) throw new Error("LOGGLY_SUBDOMAIN must be defined");
                return new LogglyProvider(logOrigin);

            case LogProviderTypes.papertrail:
                if (!process.env.PAPER_TRAIL_SERVICE) throw new Error("PAPER_TRAIL_HOST must be defined");
                if (!process.env.PAPER_TRAIL_PORT) throw new Error("PAPER_TRAIL_PORT must be defined");
                return new PapertrailProvider(logOrigin);
            default:
                throw new Error("No matching log provider found.");
        }
    }
}
