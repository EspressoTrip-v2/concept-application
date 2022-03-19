import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AbstractGrpcServer, LogCodes, UserRoles } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { ProtoGrpcType } from "./proto/employee";
import { EmployeeServiceHandlers } from "./proto/employeePackage/EmployeeService";
import { EmployeeId } from "./proto/employeePackage/EmployeeId";
import { GrpcEmployeeAttributes } from "./proto/employeePackage/GrpcEmployeeAttributes";
import { Employee } from "../models";
import { GrpcResponsePayload } from "./proto/employeePackage/GrpcResponsePayload";
import { CreateUserPublisher, DeleteUserPublisher, UpdateUserPublisher } from "../events";
import { LocalLogger } from "../utils";

export class GrpcServer extends AbstractGrpcServer {
    readonly m_protoPath = __dirname + "/proto/employee.proto";
    readonly m_port = process.env.GRPC_SERVER_PORT!;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.employeePackage;

    readonly m_server = new grpc.Server();

    private m_rpcMethods: EmployeeServiceHandlers = {
        CreateEmployee: async (call: grpc.ServerUnaryCall<GrpcEmployeeAttributes, GrpcResponsePayload>, callback: grpc.sendUnaryData<GrpcResponsePayload>) => {
            try {
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
                    division: data.division!,
                    region: data.region!,
                    country: data.country!,
                    phoneNumber: data.phoneNumber!,
                    userRole: data.userRole! as UserRoles,
                });
                await employee.save();
                LocalLogger.log(LogCodes.CREATED, "Employee created", "employee/employee-service/src/services/grpc-server.ts:45", `email: ${employee.email}, employeeId: ${employee.id}`);
                const employeeMsg = {
                    ...Employee.convertToMessage(employee),
                    password: call.request.password!,
                };

                CreateUserPublisher.createUserPublisher().publish(employeeMsg);

                callback(null, {
                    status: 200,
                    data: Employee.convertToMessage(employee),
                });
            } catch (error) {
                const serverError: Partial<grpc.StatusObject> = {
                    code: grpc.status.INTERNAL,
                    details: "Could not create new employee, employee save failed",
                };
                LocalLogger.log(LogCodes.ERROR, "Employee create error", "employee/employee-service/src/services/grpc-server.ts:62", `error: ${(error as Error).message}`);
                return callback(serverError);
            }
        },

        DeleteEmployee: async (call: grpc.ServerUnaryCall<EmployeeId, GrpcResponsePayload>, callback: grpc.sendUnaryData<GrpcResponsePayload>) => {
            const { id }: EmployeeId = call.request;
            const deletedEmployee = await Employee.findByIdAndDelete(id);
            if (!deletedEmployee) {
                LocalLogger.log(LogCodes.ERROR, "Employee not found", "employee/employee-service/src/services/grpc-server.ts:71", `Employee: ${id} does not exist`);
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Employee not found.",
                });
            }
            LocalLogger.log(
                LogCodes.DELETED,
                "Employee deleted",
                "employee/employee-service/src/services/grpc-server.ts:77",
                `email: ${deletedEmployee.email}, employeeId: ${deletedEmployee.id}`
            );
           DeleteUserPublisher.deleteUserPublisher().publish(Employee.convertToMessage(deletedEmployee));
            return callback(null, {
                status: 200,
                data: Employee.convertToMessage(deletedEmployee),
            });
        },

        GetEmployee: async (call: grpc.ServerUnaryCall<EmployeeId, GrpcResponsePayload>, callback: grpc.sendUnaryData<GrpcResponsePayload>) => {
            const { id }: EmployeeId = call.request;
            const employee = await Employee.findById(id);
            if (!employee) {
                LocalLogger.log(LogCodes.ERROR, "Employee not found", "employee/employee-service/src/services/grpc-server.ts:94", `Employee: ${id} does not exist`);
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Employee not found.",
                });
            }
            return callback(null, {
                status: 200,
                data: employee,
            });
        },
        UpdateEmployee: async (call: grpc.ServerUnaryCall<GrpcEmployeeAttributes, GrpcResponsePayload>, callback: grpc.sendUnaryData<GrpcResponsePayload>) => {
            try {
                const employeeUpdate: GrpcEmployeeAttributes = call.request;
                const { id } = employeeUpdate;
                delete employeeUpdate.id;

                const employee = await Employee.findById(id);
                if (!employee) {
                    LocalLogger.log(LogCodes.ERROR, "Employee not found", "employee/employee-service/src/services/grpc-server.ts:113", `email: ${employeeUpdate.email}, employeeId: ${id}`);
                    return callback({
                        code: grpc.status.NOT_FOUND,
                        details: "Employee not found",
                    });
                }
                employee.set({ ...employeeUpdate });
                await employee.save();
                LocalLogger.log(LogCodes.UPDATED, "Employee updated", "employee/employee-service/src/services/grpc-server.ts:121", `email: ${employee.email}, employeeId: ${employee.id}`);
                UpdateUserPublisher.updateUserPublisher().publish({
                    ...Employee.convertToMessage(employee),
                    password: call.request.password!,
                });
                return callback(null, {
                    status: 200,
                    data: Employee.convertToMessage(employee),
                });
            } catch (error) {
                const serverError: Partial<grpc.StatusObject> = {
                    code: grpc.status.INTERNAL,
                    details: "Could not create new employee, employee save failed",
                };
                LocalLogger.log(LogCodes.ERROR, "Employee update error", "employee/employee-service/src/services/grpc-server.ts:135", `error: ${(error as Error).message}`);
                return callback(serverError);
            }
        },
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
