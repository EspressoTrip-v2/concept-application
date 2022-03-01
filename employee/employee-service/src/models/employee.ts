import mongoose from "mongoose";
import { EmployeeAttrs, EmployeeDoc, EmployeeModel } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { PersonMsg, GenderType, MicroServiceNames, RaceTypes, ShiftPreference, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";
import { Password } from "../utils";

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
        authId: { type: String, default: "" },
        country: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        signInType: { type: String, required: true, default: SignInTypes.UNKNOWN },
        userRole: {
            type: String,
            default: UserRoles.EMPLOYEE,
        },
        password: { type: String, default: "" },
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

/** Encrypt the password on save */
employeeSchema.pre("save", async function (done) {
    const password = this.get("password");
    if (password && this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});
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
 */
employeeSchema.statics.convertToGrpcMessageForAuth = function (document: EmployeeDoc): PersonMsg {
    return {
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
        position: document.position,
        providerId: document.providerId,
        shiftPreference: document.shiftPreference as ShiftPreference,
        startDate: document.startDate,
        signInType: document.signInType,
        userRole: document.userRole as UserRoles,
        firstName: document.firstName,
        phoneNumber: document.phoneNumber,
    };
};

employeeSchema.statics.updateByEvent = async function (employee: PersonMsg): Promise<EmployeeDoc | null> {
    if (!employee.version) return Employee.findOneAndUpdate({ email: employee.email }, employee);
    return Employee.findOneAndUpdate({ email: employee.email, version: employee.version }, employee);
};
/** Create model from schema */
const Employee = mongoose.model<EmployeeDoc, EmployeeModel>("Employee", employeeSchema);
export { Employee };
