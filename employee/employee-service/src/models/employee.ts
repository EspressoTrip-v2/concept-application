import mongoose from "mongoose";
import { EmployeeAttrs, EmployeeDoc, EmployeeModel } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { PersonMsg, GenderType, RaceTypes, ShiftPreference, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";

/**
 * User model that uses update-if-current version incrementation
 */
const employeeSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        race: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: String, required: true },
        shiftPreference: { type: String, required: true },
        branchName: { type: String, required: true },
        region: { type: String, required: true },
        registeredEmployee: { type: Boolean, default: true },
        division: { type: String, required: true },
        authId: { type: String, default: "" },
        country: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        signInType: { type: String, required: true, default: SignInTypes.UNKNOWN },
        userRole: { type: String, required: true },
        password: { type: String, required: true },
        providerId: { type: String, default: "" },
    },
    {
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

/** Replace the __v with version  && use the update-if-current plugin*/
employeeSchema.set("versionKey", "version");
employeeSchema.plugin(updateIfCurrentPlugin);

/** Static schema functions */
/**
 * Static function to build product
 * @param attributes
 */
employeeSchema.statics.build = function (attributes: EmployeeAttrs): EmployeeDoc {
    return new Employee(attributes);
};

/**
 * Converts employee document to employee message object to create a auth user
 * @param document {EmployeeDoc}
 * @param withVersion {boolean}
 */
employeeSchema.statics.convertToMessage = function (document: EmployeeDoc, withVersion: boolean): PersonMsg {
    const msg: PersonMsg = {
        id: document.id,
        country: document.country,
        email: document.email,
        gender: document.gender as GenderType,
        branchName: document.branchName,
        lastName: document.lastName,
        password: document.password,
        race: document.race as RaceTypes,
        region: document.region,
        registeredEmployee: document.registeredEmployee,
        division: document.division,
        position: document.position,
        providerId: document.providerId,
        shiftPreference: document.shiftPreference as ShiftPreference,
        startDate: document.startDate,
        signInType: document.signInType,
        userRole: document.userRole as UserRoles,
        firstName: document.firstName,
        phoneNumber: document.phoneNumber,
        version: document.version,
    };
    if (!withVersion) delete msg.version;
    return msg;
};

employeeSchema.statics.findByEvent = async function (employee: PersonMsg): Promise<EmployeeDoc | null> {
    if (!employee.version) return await Employee.findOne({ email: employee.email });
    return await Employee.findOne({ email: employee.email, version: employee.version - 1 });
};
/** Create model from schema */
const Employee = mongoose.model<EmployeeDoc, EmployeeModel>("Employee", employeeSchema);
export { Employee };
