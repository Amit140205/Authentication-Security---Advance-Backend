import { app } from "./app.js";
import { env } from "./config/env.config.js";
import { logger } from "./config/logger.config.js";
import prisma from "./lib/prisma.js";

const PORT = env.PORT;

// const startServer = () => {
//     try {
//         app.listen(PORT, () => {
//             logger.info(`Server is running on port ${PORT}`);
//         });
//     } catch (error) {
//         logger.error(error);
//         process.exit(1);
//     }
// };

// startServer();

// better approach
const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully`);

    server.close(async () => {
        await prisma.$disconnect();

        logger.info("Database disconnected");

        process.exit(0);
    });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error) => {
    logger.error(error);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    logger.error(reason);
    process.exit(1);
});

//graceful shutdown
// SIGINT and SIGTERM are operating system signals that tell a Node.js server to stop running, giving it a chance to finish active requests and clean up resources before exiting.

// process.exit(0) signals that a program finished successfully,
// while process.exit(1) signals that it terminated due to an error or failure.

// SIGINT (Signal 2 - Interrupt): Triggered by Ctrl + C in the terminal. Primarily used in local development.
// SIGTERM (Signal 15 - Terminate): Sent by process managers, kill <PID>, Docker, or Kubernetes. Standard signal for production shutdowns.
// SIGKILL (Signal 9 - Kill): Immediate, forced termination by the OS kernel. Cannot be caught or ignored.