import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/employee";
import { AbstractGrpcClient, grpcErrorTranslator, GrpcServicePortDns } from "@espressotrip-org/concept-common";
import { EmployeeServiceClient } from "./proto/employeePackage/EmployeeService";
import { EmployeeResponsePayload } from "./proto/employeePackage/EmployeeResponsePayload";
import { EmployeeId } from "./proto/employeePackage/EmployeeId";
import {GoogleGrpcUser} from "./proto/employeePackage/GoogleGrpcUser";
import {GrpcResponsePayload} from "./proto/employeePackage/GrpcResponsePayload";
import {GitHubGrpcUser} from "./proto/employeePackage/GitHubGrpcUser";
import {LocalGrpcUser} from "./proto/employeePackage/LocalGrpcUser";

export class GrpcEmployeeDashClient extends AbstractGrpcClient {
    static m_instance: GrpcEmployeeDashClient | undefined;
    readonly m_protoPath = __dirname + "/proto/employee.proto";
    readonly m_port = GrpcServicePortDns.EMPLOYEE_DASH_SERVICE_DNS;
    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.employeePackage;
    // @ts-ignore
    m_client: EmployeeServiceClient;

    constructor() {
        super();
    }

    static getClient(): GrpcEmployeeDashClient {
        if (this.m_instance === undefined) {
            this.m_instance = new GrpcEmployeeDashClient();
            return this.m_instance;
        }
        return this.m_instance;
    }

    async getEmployee(id: string): Promise<EmployeeResponsePayload> {
        const grpcEmployeeId: EmployeeId = {
            id,
        };
        return new Promise(async (resolve, reject) => {
            this.m_client.GetEmployee(grpcEmployeeId, (error: grpc.ServiceError | null, responsePayload?: EmployeeResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(responsePayload!);
            });
        });
    }
 
    loginGoogleUser(user: GoogleGrpcUser): Promise<GrpcResponsePayload> {
        return new Promise(async (resolve, reject) => {
            this.m_client.LoginGoogleUser(user, (error: grpc.ServiceError | null, createUserInfo?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(createUserInfo!);
            });
        });
    }

    loginGitHubUser(user: GitHubGrpcUser): Promise<GrpcResponsePayload> {
        return new Promise((resolve, reject) => {
            this.m_client.LoginGitHubUser(user, (error: grpc.ServiceError | null, createUserInfo?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(createUserInfo!);
            });
        });
    }

    loginLocalUser(user: LocalGrpcUser): Promise<GrpcResponsePayload> {
        return new Promise((resolve, reject) => {
            this.m_client.LoginLocalUser(user, (error: grpc.ServiceError | null, createUserInfo?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(createUserInfo!);
            });
        });
    }

    connect(logMsg: string): void {
        this.m_client = new this.m_package.EmployeeService(this.m_port, grpc.credentials.createInsecure());
        console.log(logMsg + "Connected on " + GrpcServicePortDns.AUTH_SERVICE_DNS);
    }
}
