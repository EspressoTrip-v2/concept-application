import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AbstractGrpcClient, grpcErrorTranslator, GrpcServicePortDns } from "@espressotrip-org/concept-common";
import { ProtoGrpcType } from "./proto/employee";
import { GrpcEmployeeAttributes } from "./proto/employeePackage/GrpcEmployeeAttributes";
import { EmployeeId } from "./proto/employeePackage/EmployeeId";
import { GrpcResponsePayload } from "./proto/employeePackage/GrpcResponsePayload";

export class GrpcEmployeeClient extends AbstractGrpcClient {
    readonly m_protoPath = __dirname + "/proto/employee.proto";
    readonly m_port = GrpcServicePortDns.EMPLOYEE_SERVICE_DNS;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.employeePackage;

    constructor() {
        super();
    }

    /**
     * Creates a new employee
     * @param employee {GrpcEmployeeAttributes}
     */
    createEmployee(employee: GrpcEmployeeAttributes): Promise< GrpcResponsePayload> {
        const client = new this.m_package.EmployeeService(this.m_port, grpc.credentials.createInsecure());
        return new Promise(async (resolve, reject) => {
            client.CreateEmployee(employee, (error: grpc.ServiceError | null, responsePayload?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(responsePayload!);
            });
        });
    }

    /**
     * Get single employee
     * @param employeeId {string}
     */
    getEmployee(employeeId: string): Promise<GrpcResponsePayload> {
        const grpcEmployeeId: EmployeeId = {
            id: employeeId,
        };
        const client = new this.m_package.EmployeeService(this.m_port, grpc.credentials.createInsecure());
        return new Promise(async (resolve, reject) => {
            client.GetEmployee(grpcEmployeeId, (error: grpc.ServiceError | null, responsePayload?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(responsePayload!);
            });
        });
    }

    /**
     * Creates a new employee
     * @param employee {GrpcEmployeeAttributes}
     */
    updateEmployee(employee: GrpcEmployeeAttributes): Promise<GrpcResponsePayload> {
        const client = new this.m_package.EmployeeService(this.m_port, grpc.credentials.createInsecure());
        return new Promise(async (resolve, reject) => {
            client.UpdateEmployee(employee, (error: grpc.ServiceError | null, responsePayload?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(responsePayload!);
            });
        });
    }

    /**
     * Delete single employee
     * @param employeeId {string}
     */
    deleteEmployee(employeeId: string): Promise< GrpcResponsePayload> {
        const grpcEmployeeId: EmployeeId = {
            id: employeeId,
        };
        const client = new this.m_package.EmployeeService(this.m_port, grpc.credentials.createInsecure());
        return new Promise(async (resolve, reject) => {
            client.DeleteEmployee(grpcEmployeeId, (error: grpc.ServiceError | null, responsePayload?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(responsePayload!);
            });
        });
    }
}

export const employeeGrpcClient = new GrpcEmployeeClient();
