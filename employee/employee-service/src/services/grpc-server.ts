import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AbstractGrpcServer, LogCodes, LogPublisher, MicroServiceNames } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { ProtoGrpcType } from "./proto/employee";
import { EmployeeServiceHandlers } from "./proto/employeePackage/EmployeeService";
import { GrpcEmployeeInfo } from "./proto/employeePackage/GrpcEmployeeInfo";
import { EmployeeId } from "./proto/employeePackage/EmployeeId";
import { GrpcEmployeeAttributes } from "./proto/employeePackage/GrpcEmployeeAttributes";
import { Employee } from "../models";

export class GrpcServer extends AbstractGrpcServer {
    readonly m_protoPath = __dirname + "/proto/employee.proto";
    readonly m_port = process.env.GRPC_SERVER_PORT!;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.employeePackage;

    readonly m_server = new grpc.Server();

    /** Event Logger */
    private m_logger = LogPublisher.getPublisher(this.m_rabbitConnection!, MicroServiceNames.EMPLOYEE_SERVICE, "employee-service:gRPC-server");

    private m_rpcMethods: EmployeeServiceHandlers = {
        CreateEmployee: async (call: grpc.ServerUnaryCall<GrpcEmployeeAttributes, GrpcEmployeeInfo>, callback: grpc.sendUnaryData<GrpcEmployeeInfo>) => {
            const data: GrpcEmployeeAttributes = call.request;
            const employee = Employee.build({
                firstName: data.firstName!,
                lastName: data.lastName!,
                email: data.email!,
                gender: data.gender!,
                race: data.race!,
                password: data.password!,
                position: data.position!,
                startDate: data.startDate!,
                shiftPreference: data.shiftPreference!,
                branchName: data.branchName!,
                region: data.region!,
                country: data.country!,
                phoneNumber: data.phoneNumber!,
            });
            await employee.save().catch(error => {
                if (error) {
                    const serverError: Partial<grpc.StatusObject> = {
                        code: grpc.status.INTERNAL,
                        details: "Could not create new employee, employee save failed",
                    };
                    this.m_logger.publish(LogCodes.ERROR, "Employee save failed", "CreateEmployee()", `email: ${employee.email}, id: ${employee.id}`);

                    return callback(serverError);
                }
            });
            this.m_logger.publish(LogCodes.CREATED, "Employee created", "CreateEmployee()", `email: ${employee.email}, id: ${employee.id}`);
        },
        DeleteEmployee: (call: grpc.ServerUnaryCall<EmployeeId, GrpcEmployeeInfo>, callback: grpc.sendUnaryData<GrpcEmployeeInfo>) => {},
        GetEmployee: (call: grpc.ServerUnaryCall<EmployeeId, GrpcEmployeeInfo>, callback: grpc.sendUnaryData<GrpcEmployeeInfo>) => {},
        UpdateEmployee: (call: grpc.ServerUnaryCall<GrpcEmployeeAttributes, GrpcEmployeeInfo>, callback: grpc.sendUnaryData<GrpcEmployeeInfo>) => {},
    };

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection);
    }

    /**
     * Start the server
     */
    listen(logMessage: string): GrpcServer {
        this.m_server.addService(this.m_package.EmployeeService.service, {
            CreateEmployee: this.m_rpcMethods.CreateEmployee,
            DeleteEmployee: this.m_rpcMethods.DeleteEmployee,
            GetEmployee: this.m_rpcMethods.GetEmployee,
            UpdateEmployee: this.m_rpcMethods.UpdateEmployee,
        });

        this.m_server.bindAsync(this.m_port, grpc.ServerCredentials.createInsecure(), (error: Error | null, port: number) => {
            if (error) throw new Error(error.message);
            console.log(logMessage);
            this.m_server.start();
        });
        return this;
    }
}

/**
 * Constructs gRPC server with Rabbit client for logging
 * @param rabbitConnection
 */
export const grpcServer = (rabbitConnection: amqp.Connection): GrpcServer => new GrpcServer(rabbitConnection);
