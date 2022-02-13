import mongoose from "mongoose";
import { MicroServiceNames } from "@espressotrip-org/concept-common";

export function addAnalytics<T>(document: mongoose.Document): T {
    const data = document as unknown as T;
    // @ts-ignore
    data["analytics"] = {
        serviceName: MicroServiceNames.AUTH_SERVICE,
        dateSent: new Date().toISOString(),
    };
    return data;
}
