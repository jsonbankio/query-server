import {Env} from "@xpresser/env";
import path from "path";

// Set Env
let envDir = __dirname;

// If in development, i.e running form dist, set envDir to parent.
if(__filename.includes("/dist/")) {
    envDir = path.join(__dirname, "/../");
}

console.log("Env directory:", envDir);

// Validate Env
export const env = Env(envDir, {
    NODE_ENV: Env.is.enum(["development", "production"], "development"),
    APP_NAME: Env.is.string("Jsonbank Query Server"),
    JSB_QUERY_SERVER_PORT: Env.is.number(2224),
})
