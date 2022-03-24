import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AbstractGrpcClient, grpcErrorTranslator, GrpcServicePortDns } from "@espressotrip-org/concept-common";
import { ProtoGrpcType } from "./proto/employee";
import { GrpcEmployeeAttributes } from "./proto/employeePackage/GrpcEmployeeAttributes";
import { EmployeeId } from "./proto/employeePackage/EmployeeId";
import { GrpcResponsePayload } from "./proto/employeePackage/GrpcResponsePayload";
import { EmployeeServiceClient } from "./proto/employeePackage/EmployeeService";
import { GrpcAllEmployeesResponsePayload } from "./proto/employeePackage/GrpcAllEmployeesResponsePayload";

export class GrpcEmployeeClient extends AbstractGrpcClient {
    static m_instance: GrpcEmployeeClient | undefined
    readonly m_protoPath = __dirname + "/proto/employee.proto";
    readonly m_port = GrpcServicePortDns.EMPLOYEE_SERVICE_DNS;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.employeePackage;
    // @ts-ignore
    m_client: EmployeeServiceClient

    constructor() {
        super();
    }

    static getClient(): GrpcEmployeeClient {
        if (this.m_instance === undefined) {
            this.m_instance = new GrpcEmployeeClient()
            return this.m_instance
        }
        return this.m_instance
    }

    /**
     * Creates a new employee
     * @param employee {GrpcEmployeeAttributes}
     */
    createEmployee(employee: GrpcEmployeeAttributes): Promise< GrpcResponsePayload> {
        return new Promise(async (resolve, reject) => {
            this.m_client.CreateEmployee(employee, (error: grpc.ServiceError | null, responsePayload?: GrpcResponsePayload) => {
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
        return new Promise(async (resolve, reject) => {
            this.m_client.GetEmployee(grpcEmployeeId, (error: grpc.ServiceError | null, responsePayload?: GrpcResponsePayload) => {
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
        return new Promise(async (resolve, reject) => {
            this.m_client.UpdateEmployee(employee, (error: grpc.ServiceError | null, responsePayload?: GrpcResponsePayload) => {
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
        return new Promise(async (resolve, reject) => {
            this.m_client.DeleteEmployee(grpcEmployeeId, (error: grpc.ServiceError | null, responsePayload?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(responsePayload!);
            });
        });
    }

    /**
     * Get all employees
     */
    getAllEmployees(): Promise<GrpcAllEmployeesResponsePayload> {
        return new Promise(async (resolve, reject) => {
            this.m_client.GetAllEmployees({}, (error: grpc.ServiceError | null, responsePayload?: GrpcAllEmployeesResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(responsePayload!);
            });
        });
    }
    connect(loMsg: string): void {
        this.m_client = new this.m_package.EmployeeService(this.m_port, grpc.credentials.createInsecure());
        console.log(loMsg + "Connected on " + GrpcServicePortDns.EMPLOYEE_SERVICE_DNS);
    }

}

