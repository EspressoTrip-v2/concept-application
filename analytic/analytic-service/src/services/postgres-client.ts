import { AbstractPostgresClient } from "@espressotrip-org/concept-common/build/postgres/abstract-postgres-client";

export class PostgresClient extends AbstractPostgresClient {
    constructor() {
        super(
            process.env.POSTGRES_SERVICE_NAME!,
            process.env.ANALYTIC_POSTGRES_PASSWORD!,
            process.env.POSTGRES_USERNAME!,
            "analytic",
            parseInt(process.env.POSTGRES_PORT!),
        );
    }
}

export const postgresClient = new PostgresClient();
