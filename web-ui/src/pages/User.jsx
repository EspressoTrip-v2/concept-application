import { useStoreState, useStoreActions } from "easy-peasy";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getUser from "../helpers";
import ReactCountryFlag from "react-country-flag";
var countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const User = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setUserAuthorised = useStoreActions(actions => actions.setUserAuthorised);
    const userAuthorised = useStoreState(state => state.userAuthorised);

    const setUser = useStoreActions(actions => actions.setUser);
    const user = useStoreState(state => state.user);

    const userStatus = async () => {
        const result = await getUser();
        await setUserAuthorised(result.status);
        await setUser(result.data.data);
        return result;
    };

    useLayoutEffect(() => {
        setLoading(true);
        userStatus();
        if (!userAuthorised) {
            navigate("/login");
        }
        setLoading(false);
    }, [userAuthorised]);

    useEffect(() => {
        setLoading(true);
        userStatus();
        if (!userAuthorised) {
            navigate("/login");
        }
        setLoading(false);
    }, []);

    const userInitials = () => {
        if (user.firstName && user.lastName) {
            let initals = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
            return initals.toUpperCase();
        }
    };

    const USER_PROFILE = {
        contactInfo: {
            title: "Contact Information",
            fields: [
                {
                    label: "Email",
                    value: user.email,
                },
                {
                    label: "Phone Number",
                    value: user.phoneNumber,
                },
            ],
        },
        jobInfo: {
            title: "Job Information",
            fields: [
                {
                    label: "Role",
                    value: user.userRole,
                },
                {
                    label: "Branch",
                    value: user.branchName,
                },
                {
                    label: "Shift Preference",
                    value: user.shiftPreference,
                },
                {
                    label: "Region",
                    value: user.region,
                },
                {
                    label: "Registered Employee",
                    value: user.registeredEmployee ? "Yes" : "No",
                },
            ],
        },
        personalInfo: {
            title: "Personal Information",
            fields: [
                {
                    label: "Race",
                    value: user.race,
                },
                {
                    label: "Gender",
                    value: user.gender,
                },
                {
                    label: "Country",
                    value: user.country,
                },
            ],
        },
        securityInfo: {
            title: "Security Information",
            fields: [
                {
                    label: "User Role",
                    value: user.userRole,
                },
            ],
        },
    };

    const capitalize = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const generateFlag = countryCode => {
        if (countryCode === "N/A") return;

        return (
            <>
                <ReactCountryFlag
                    className="emojiFlag"
                    countryCode={countryCode}
                    style={{
                        fontSize: "1rem",
                        lineHeight: "1rem",
                    }}
                    aria-label={countryCode}
                />

                <span>{countries.getName(countryCode, "en")} - </span>
            </>
        );
    };

    const generateBox = ({ title, fields }) => {
        return (
            <div className="box">
                <div className="box--title">{title}</div>
                <div className="box_details">
                    {fields.map(({ label, value }) => {
                        return (
                            <div key={`${label}${value}`} className="box_details-col">
                                <div className="box--subtitle">{label}</div>
                                <div className="box--value">
                                    {label === "Country" && generateFlag(value)}
                                    {label === "" ? "N/A" : label !== "Email" ? capitalize(value) : value}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="user">
            <div className="user_top">
                <div className="user_top-logo">{userInitials()}</div>
                <div className="user_top-name">{`${user.firstName} ${user.lastName}`}</div>
            </div>
            <div className="user_bottom">
                <div className="user_details">
                    <div className="user_details__column">
                        {generateBox(USER_PROFILE.contactInfo)}
                        {generateBox(USER_PROFILE.jobInfo)}
                    </div>
                    <div className="user_details__column">
                        {generateBox(USER_PROFILE.personalInfo)}
                        {generateBox(USER_PROFILE.securityInfo)}
                    </div>
                </div>
            </div>
        </div>
    );
};

// <div className="">
//     <div className="row">
//         {user ? (
//             <div className="col-md-12">
//                 <h1>User Details</h1>
//                 <ul>
//                     {Object.keys(user).map(key => (
//                         <li key={key}>
//                             <b>{key}</b>: {user[key] !== "" ? user[key] : "N/A"}
//                         </li>
//                     ))}
//                 </ul>
//                 {user.country && (
//
//                 )}
//             </div>
//         ) : (
//             <div className="col-md-12">
//                 <h1>Loading...</h1>
//             </div>
//         )}
//     </div>
// </div>
export default User;
