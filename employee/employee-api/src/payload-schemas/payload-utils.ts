import dayjs from "dayjs";

export function isValidStartDate(dateString: string): string {
    const date = dayjs(dateString, "YYYY-MM-DD", true).startOf("day");
    const validDate = date.isValid();
    if (!validDate) throw new Error("Invalid export from date string");
    return date.toISOString();
}