import pino from "pino";
import { env } from "./env.config.js";

export const logger = pino({
    transport: env.NODE_ENVIRONMENT === "development" ? {
        target: "pino-pretty"
    } : undefined
});

// now we can replace console.log("") with logger.info("") or console.error(error) with logger.error(error)