import Joi from "joi";
import { GenderType, RaceTypes, ShiftPreference, UserRoles } from "@espressotrip-org/concept-common";
import { isValidStartDate } from "./payload-utils";

export const createEmployeeSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    gender: Joi.string().valid(GenderType.MALE, GenderType.FEMALE, GenderType.UNDEFINED).required(),
    race: Joi.string().valid(RaceTypes.BLACK, RaceTypes.ASIAN, RaceTypes.UNDEFINED, RaceTypes.INDIAN, RaceTypes.WHITE).required(),
    position: Joi.string().required(),
    startDate: Joi.string().custom(isValidStartDate, "Check if startDate is a valid date"),
    shiftPreference: Joi.string().valid(ShiftPreference.DAY, ShiftPreference.NIGHT, ShiftPreference.ANY),
    branchName: Joi.string().required(),
    division: Joi.string().required(),
    region: Joi.string().required(),
    country: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
    userRole: Joi.string().valid(UserRoles.EMPLOYEE, UserRoles.ADMIN).required(),
});
