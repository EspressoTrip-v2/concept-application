import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/product";
import { AbstractGrpcServer } from "@espressotrip-org/concept-common/build/grpc";
import { ClientProductsRequest } from "./proto/productPackage/ClientProductsRequest";
import { ServerStreamProductsResponse } from "./proto/productPackage/ServerStreamProductsResponse";
import { Product } from "./models";

export class GrpcServer extends AbstractGrpcServer {
    readonly m_protoPath = __dirname + "/proto/product.proto";
    readonly m_port = process.env.GRPC_SERVER_PORT!;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.productPackage;

    readonly m_server = new grpc.Server();

    async GetAllProducts(call: grpc.ServerWritableStream<ClientProductsRequest, ServerStreamProductsResponse>): Promise<void> {
        Product.find({})
            .cursor()
            .on("data", product => {
                call.write(product);
            })
            .on("end", () => {
                call.end();
            });
    }

    listen(): void {
        this.m_server.addService(this.m_package.ProductService.service, {
            GetAllProducts: this.GetAllProducts,
        });

        this.m_server.bindAsync(this.m_port, grpc.ServerCredentials.createInsecure(), (error: Error | null, port: number) => {
            if (error) throw new Error(error.message);
            console.log(`[product:gRPC]: Listening port 50051`);
            this.m_server.start();
        });
    }
}

export const grpcServer = new GrpcServer();
