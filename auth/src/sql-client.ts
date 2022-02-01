import { Sequelize } from "sequelize";

export class SqlClient {
    private readonly m_connection: Sequelize;
    private m_models: any = {};

    constructor() {
        this.m_connection = new Sequelize({
            dialect: "postgres",
            host: "auth-sql-service",
            port: 5432,
            username: "postgres",
            password: process.env.POSTGRES_PASSWORD!,
        });
    }
    /**
     * Creates or syncs the supplied model to the database
     * @param modelName {string} - Model name to store in client
     * @param model {Models} - Model type
     */
    async createORM(modelName: string, model: any ): Promise<SqlClient> {
        console.log(`[auth:mysql]: Create/Sync model ${modelName}`);
        const newModel = this.m_connection.define(modelName, model);
        await newModel.sync({logging: false});
        this.m_models[modelName] = newModel;
        return this;
    }

    get connection(): Sequelize {
        return this.m_connection;
    }

    async connect(): Promise<SqlClient> {
        await this.m_connection.authenticate({logging: false});
        return this;
    }
}
export const sqlClient = new SqlClient();
