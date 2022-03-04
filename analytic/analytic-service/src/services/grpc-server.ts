import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/analytic";
import { AbstractGrpcServer } from "@espressotrip-org/concept-common/build/grpc";
import amqp from "amqplib";

export class GrpcServer extends AbstractGrpcServer {
    readonly m_protoPath = __dirname + "/proto/analytic.proto";
    readonly m_port = process.env.GRPC_SERVER_PORT!;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.analyticsPackage;

    readonly m_server = new grpc.Server();

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection);
    }

    // TODO: NEED TO CREATE SERVICE RPC CALLS HERE

    listen(logMessage: string): GrpcServer {
        this.m_server.addService(this.m_package.AnalyticService.service, {});

        this.m_server.bindAsync(this.m_port, grpc.ServerCredentials.createInsecure(), (error: Error | null, port: number) => {
            if (error) throw new Error(error.message);
            console.log(logMessage);
            this.m_server.start();
        });

        return this;
    }
}

export const grpcServer = (rabbitConnection: amqp.Connection): GrpcServer => new GrpcServer(rabbitConnection);
