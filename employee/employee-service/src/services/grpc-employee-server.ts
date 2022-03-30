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
import { CreateUserPublisher, DeleteUserPublisher, UpdateEmployeeTaskPublisher, UpdateUserPublisher } from "../events";
import { LocalLogger } from "../utils";
import { AllEmployees } from "./proto/employeePackage/AllEmployees";
import { GrpcAllEmployeesResponsePayload } from "./proto/employeePackage/GrpcAllEmployeesResponsePayload";

export class GrpcEmployeeServer extends AbstractGrpcServer {
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
                LocalLogger.log(
                    LogCodes.CREATED,
                    "Employee created",
                    "employee/employee-service/src/services/grpc-employee-server.ts:48",
                    `email: ${employee.email}, employeeId: ${employee.id}`
                );
                const employeeMsg = {
                    ...Employee.convertToMessage(employee, true),
                    password: call.request.password!,
                };
                CreateUserPublisher.createUserPublisher().publish(employeeMsg);

                callback(null, {
                    status: 200,
                    data: Employee.convertToMessage(employee, true),
                });
            } catch (error) {
                const serverError: Partial<grpc.StatusObject> = {
                    code: grpc.status.INTERNAL,
                    details: "Could not create new employee, employee save failed",
                };
                LocalLogger.log(
                    LogCodes.ERROR,
                    "Employee create error",
                    "employee/employee-service/src/services/grpc-employee-server.ts:69",
                    `error: ${(error as Error).message}`
                );
                return callback(serverError);
            }
        },

        DeleteEmployee: async (call: grpc.ServerUnaryCall<EmployeeId, GrpcResponsePayload>, callback: grpc.sendUnaryData<GrpcResponsePayload>) => {
            const { id }: EmployeeId = call.request;
            const deletedEmployee = await Employee.findByIdAndDelete(id);
            if (!deletedEmployee) {
                LocalLogger.log(
                    LogCodes.ERROR,
                    "Employee not found",
                    "employee/employee-service/src/services/grpc-employee-server.ts:83",
                    `Employee: ${id} does not exist`
                );
                return callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Employee not found.",
                });
            }
            LocalLogger.log(
                LogCodes.DELETED,
                "Employee deleted",
                "employee/employee-service/src/services/grpc-employee-server.ts:94",
                `email: ${deletedEmployee.email}, employeeId: ${deletedEmployee.id}`
            );
            DeleteUserPublisher.deleteUserPublisher().publish(Employee.convertToMessage(deletedEmployee, true));
            return callback(null, {
                status: 200,
                data: Employee.convertToMessage(deletedEmployee, true),
            });
        },

        GetEmployee: async (call: grpc.ServerUnaryCall<EmployeeId, GrpcResponsePayload>, callback: grpc.sendUnaryData<GrpcResponsePayload>) => {
            const { id }: EmployeeId = call.request;
            const employee = await Employee.findById(id);
            if (!employee) {
                LocalLogger.log(
                    LogCodes.ERROR,
                    "Employee not found",
                    "employee/employee-service/src/services/grpc-employee-server.ts:111",
                    `Employee: ${id} does not exist`
                );
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
                    LocalLogger.log(
                        LogCodes.ERROR,
                        "Employee not found",
                        "employee/employee-service/src/services/grpc-employee-server.ts:135",
                        `email: ${employeeUpdate.email}, employeeId: ${id}`
                    );
                    return callback({
                        code: grpc.status.NOT_FOUND,
                        details: "Employee not found",
                    });
                }

                if (employee.email != employeeUpdate.email) {
                    LocalLogger.log(
                        LogCodes.ERROR,
                        "Employee email does not match record",
                        "employee/employee-service/src/services/grpc-employee-server.ts:148",
                        `email: ${employeeUpdate.email}, employeeId: ${id}`
                    );
                    return callback({
                        code: grpc.status.NOT_FOUND,
                        details: "Employee email does not match record",
                    });
                }

                employee.set(employeeUpdate);
                await employee.save();
                LocalLogger.log(
                    LogCodes.UPDATED,
                    "Employee updated",
                    "employee/employee-service/src/services/grpc-employee-server.ts:162",
                    `email: ${employee.email}, employeeId: ${employee.id}`
                );

                // Publish changes to all required services
                UpdateUserPublisher.updateUserPublisher().publish({
                    ...Employee.convertToMessage(employee, false),
                    password: call.request.password!,
                });
                UpdateEmployeeTaskPublisher.updateEmployeeTaskPublisher().publish(Employee.convertToMessage(employee, true));
                return callback(null, {
                    status: 200,
                    data: Employee.convertToMessage(employee, true),
                });
            } catch (error) {
                const serverError: Partial<grpc.StatusObject> = {
                    code: grpc.status.INTERNAL,
                    details: "Could not create new employee, employee save failed",
                };
                LocalLogger.log(
                    LogCodes.ERROR,
                    "Employee update error",
                    "employee/employee-service/src/services/grpc-employee-server.ts:184",
                    `error: ${(error as Error).message}`
                );
                return callback(serverError);
            }
        },
        GetAllEmployees: async (
            call: grpc.ServerUnaryCall<AllEmployees, GrpcAllEmployeesResponsePayload>,
            callback: grpc.sendUnaryData<GrpcAllEmployeesResponsePayload>
        ) => {
            const employees = await Employee.find({});
            return callback(null, {
                status: 200,
                data: employees || [],
            });
        },
    };

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection);
    }

    /**
     * Start the server
     */
    listen(logMessage: string): GrpcEmployeeServer {
        this.m_server.addService(this.m_package.EmployeeService.service, {
            CreateEmployee: this.m_rpcMethods.CreateEmployee,
            DeleteEmployee: this.m_rpcMethods.DeleteEmployee,
            GetEmployee: this.m_rpcMethods.GetEmployee,
            UpdateEmployee: this.m_rpcMethods.UpdateEmployee,
            GetAllEmployees: this.m_rpcMethods.GetAllEmployees,
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
export const grpcServer = (rabbitConnection: amqp.Connection): GrpcEmployeeServer => new GrpcEmployeeServer(rabbitConnection);
