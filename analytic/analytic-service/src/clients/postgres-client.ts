import { Sequelize } from "sequelize";

export class PostgresClient {
    private readonly m_postgres: Sequelize;
    constructor() {
        this.m_postgres = new Sequelize({
            host: process.env.POSTGRES_SERVICE_NAME!,
            password: process.env.ANALYTIC_POSTGRES_PASSWORD,
            username: process.env.POSTGRES_USERNAME,
            dialect: "postgres",
            database: "analytic",
            logging: false,
            dialectOptions: {
                ssl: {
                    encrypt: true,
                    rejectUnauthorized: false,
                },
            }
        });
    }

    async connect(logMessage: string): Promise<void> {
        await this.m_postgres.authenticate();
        console.log(logMessage);
    }

    async close(): Promise<void> {
        await this.m_postgres.close();
    }
}

export const postgresClient = new PostgresClient();
