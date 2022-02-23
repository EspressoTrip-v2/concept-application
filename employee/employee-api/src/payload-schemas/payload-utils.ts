import moment from "moment/moment";

export function isValidStartDate(dateString: string): Date {
    const date = moment(dateString, "YYYY-MM-DD", true).startOf("day").toDate();
    const validDate = moment.isDate(date);
    if (!validDate) throw new Error("Invalid export from date string");
    return date;
}