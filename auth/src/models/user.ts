import { DataTypes } from "sequelize";
import { UserRoles } from "@espressotrip-org/concept-common";

export const userModel = {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userRoles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [UserRoles.BASIC],
    },
    categories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
};
