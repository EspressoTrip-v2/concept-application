import mongoose from "mongoose";
import { EmployeeAttrs, EmployeeDoc, EmployeeModel } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { MicroServiceNames, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";
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
        country: { type: String, required: true },
        phoneNUmber: { type: String, required: true },
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
/** Create model from schema */
const Employee = mongoose.model<EmployeeDoc, EmployeeModel>("Employee", employeeSchema);
export { Employee };