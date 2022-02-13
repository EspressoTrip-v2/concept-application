import { GrantConfig } from "grant";

export function grantConfig(): GrantConfig {
    return {
        defaults: {
            origin: "https://concept.dev",
            transport: "session",
            prefix: "/api/auth/connect",
        },
        google: {
            scope: ["email", "profile"],
            key: process.env.GOOGLE_CLIENT_ID,
            secret: process.env.GOOGLE_SECRET,
            callback: process.env.GOOGLE_CALLBACK_URL,
            response: ["tokens", "profile"],
            redirect_uri: "https://concept.dev/api/auth/connect/google/callback"
        },
        github: {
            scope: ["email", "profile"],
            key: process.env.GITHUB_CLIENT_ID,
            secret: process.env.GITHUB_SECRET,
            callback: process.env.GITHUB_CALLBACK_URL,
            response: ["tokens", "profile"],
            redirect_uri: "https://concept.dev/api/auth/connect/github/callback"
        },
    };
}
