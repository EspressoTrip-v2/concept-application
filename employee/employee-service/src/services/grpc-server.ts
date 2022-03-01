import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AbstractGrpcServer, LogCodes } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { ProtoGrpcType } from "./proto/employee";
import { EmployeeServiceHandlers } from "./proto/employeePackage/EmployeeService";
import { EmployeeId } from "./proto/employeePackage/EmployeeId";
import { GrpcEmployeeAttributes } from "./proto/employeePackage/GrpcEmployeeAttributes";
import { Employee } from "../models";
import { GrpcResponsePayload } from "./proto/employeePackage/GrpcResponsePayload";
import { CreateEmployeePublisher, DeleteEmployeePublisher, UpdateUserPublisher } from "../events";
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
                    region: data.region!,
                    country: data.country!,
                    phoneNumber: data.phoneNumber!,
                });
                await employee.save();
                LocalLogger.log(LogCodes.CREATED, "Employee created", "CreateEmployee", `email: ${employee.email}, employeeId: ${employee.id}`);
                const employeeMsg = {
                    ...Employee.convertToGrpcMessageForAuth(employee),
                    password: call.request.password!,
                };

                new CreateEmployeePublisher(this.m_rabbitConnection!).publish(employeeMsg);

                callback(null, {
                    status: 200,
                    data: Employee.convertToReturnPayload(employee),
                });
            } catch (error) {
                const serverError: Partial<grpc.StatusObject> = {
                    code: grpc.status.INTERNAL,
                    details: "Could not create new employee, employee save failed",
                };
                LocalLogger.log(LogCodes.ERROR, "Employee create error", "CreateEmployee", `error: ${(error as Error).message}`);
                return callback(serverError);
            }
        },

        DeleteEmployee: async (call: grpc.ServerUnaryCall<EmployeeId, GrpcResponsePayload>, callback: grpc.sendUnaryData<GrpcResponsePayload>) => {
            const { id }: EmployeeId = call.request;
            const deletedEmployee = await Employee.findByIdAndDelete(id);
            if (!deletedEmployee) {
                LocalLogger.log(LogCodes.ERROR, "Employee not found", "DeleteEmployee", `Employee: ${id} does not exist`);
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Employee not found.",
                });
            }
            LocalLogger.log(
                LogCodes.DELETED,
                "Employee deleted successfully",
                "DeleteEmployee",
                `email: ${deletedEmployee.email}, employeeId: ${deletedEmployee.id}`,
            );
            new DeleteEmployeePublisher(this.m_rabbitConnection!).publish(Employee.convertToGrpcMessageForAuth(deletedEmployee));
            return callback(null, {
                status: 200,
                data: Employee.convertToReturnPayload(deletedEmployee),
            });
        },

        GetEmployee: async (call: grpc.ServerUnaryCall<EmployeeId, GrpcResponsePayload>, callback: grpc.sendUnaryData<GrpcResponsePayload>) => {
            const { id }: EmployeeId = call.request;
            const employee = await Employee.findById(id);
            if (!employee) {
                LocalLogger.log(LogCodes.ERROR, "Employee not found", "DeleteEmployee", `Employee: ${id} does not exist`);
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
                    LocalLogger.log(LogCodes.ERROR, "Employee not found", "UpdateEmployee", `email: ${employeeUpdate.email}, employeeId: ${id}`);
                    return callback({
                        code: grpc.status.NOT_FOUND,
                        details: "Employee not found",
                    });
                }
                employee.set({ ...employeeUpdate });
                await employee.save();
                LocalLogger.log(LogCodes.UPDATED, "Employee updated", "UpdateEmployee", `email: ${employee.email}, employeeId: ${employee.id}`);
                new UpdateUserPublisher(this.m_rabbitConnection!).publish({
                    ...Employee.convertToGrpcMessageForAuth(employee),
                    password: call.request.password!,
                });
                return callback(null, {
                    status: 200,
                    data: Employee.convertToReturnPayload(employee),
                });
            } catch (error) {
                const serverError: Partial<grpc.StatusObject> = {
                    code: grpc.status.INTERNAL,
                    details: "Could not create new employee, employee save failed",
                };
                LocalLogger.log(LogCodes.ERROR, "Employee update error", "UpdateEmployee", `error: ${(error as Error).message}`);
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
