import {Env} from "@xpresser/env";
import path from "path";

// Set Env
let envDir = __dirname;

// If in development, i.e running form dist, set envDir to parent.
if(__filename.includes("/dist/")) {
    envDir = path.join(__dirname, "../");
}

// Validate Env
export const env = Env(envDir, {
    APP_PORT: Env.is.number(2224),
})
