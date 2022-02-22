import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AbstractGrpcClient, GrpcServicePorts } from "@espressotrip-org/concept-common";
import { ProtoGrpcType } from "./proto/employee";
import { GrpcEmployeeInfo } from "./proto/employeePackage/GrpcEmployeeInfo";
import { GrpcEmployeeAttributes } from "./proto/employeePackage/GrpcEmployeeAttributes";
import { EmployeeId } from "./proto/employeePackage/EmployeeId";

export class GrpcEmployeeClient extends AbstractGrpcClient {
    readonly m_protoPath = __dirname + "/proto/user.proto";
    readonly m_port = GrpcServicePorts.EMPLOYEE_SERVICE;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.employeePackage;

    constructor() {
        super();
    }

    /**
     * Creates a new employee
     * @param employee {GrpcEmployeeAttributes}
     */
    createEmployee(employee: GrpcEmployeeAttributes): Promise<grpc.ServiceError | GrpcEmployeeInfo> {
        const client = new this.m_package.EmployeeService(this.m_port, grpc.credentials.createInsecure());
        return new Promise(async (resolve, reject) => {
            client.CreateEmployee(employee, (error: grpc.ServiceError | null, employeeInfo?: GrpcEmployeeInfo) => {
                if (error) return reject(error);
                return resolve(employeeInfo!);
            });
        });
    }

    /**
     * Get single employee
     * @param employeeId {string}
     */
    getEmployee(employeeId: string): Promise<grpc.ServiceError | GrpcEmployeeInfo> {
        const grpcEmployeeId: EmployeeId = {
            id: employeeId,
        };
        const client = new this.m_package.EmployeeService(this.m_port, grpc.credentials.createInsecure());
        return new Promise(async (resolve, reject) => {
            client.GetEmployee(grpcEmployeeId, (error: grpc.ServiceError | null, employeeInfo?: GrpcEmployeeInfo) => {
                if (error) return reject(error);
                return resolve(employeeInfo!);
            });
        });
    }

    /**
     * Creates a new employee
     * @param employee {GrpcEmployeeAttributes}
     */
    updateEmployee(employee: GrpcEmployeeAttributes): Promise<grpc.ServiceError | GrpcEmployeeInfo> {
        const client = new this.m_package.EmployeeService(this.m_port, grpc.credentials.createInsecure());
        return new Promise(async (resolve, reject) => {
            client.UpdateEmployee(employee, (error: grpc.ServiceError | null, employeeInfo?: GrpcEmployeeInfo) => {
                if (error) return reject(error);
                return resolve(employeeInfo!);
            });
        });
    }

    /**
     * Delete single employee
     * @param employeeId {string}
     */
    deleteEmployee(employeeId: string): Promise<grpc.ServiceError | GrpcEmployeeInfo> {
        const grpcEmployeeId: EmployeeId = {
            id: employeeId,
        };
        const client = new this.m_package.EmployeeService(this.m_port, grpc.credentials.createInsecure());
        return new Promise(async (resolve, reject) => {
            client.DeleteEmployee(grpcEmployeeId, (error: grpc.ServiceError | null, employeeInfo?: GrpcEmployeeInfo) => {
                if (error) return reject(error);
                return resolve(employeeInfo!);
            });
        });
    }
}

export const userGrpcClient = new GrpcEmployeeClient();
