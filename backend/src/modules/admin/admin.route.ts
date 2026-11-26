import express from "express";
import { authenticationMiddleware } from "../../utils/middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../utils/middlewares/authorization.middleware.js";
import { Permissions } from "../../../generated/prisma/index.js";
import { getAllUsersController } from "./admin.controller.js";

const router = express.Router();

router.route("/all-users").get(
    authenticationMiddleware,
    authorizationMiddleware([Permissions.MANAGE_USERS]),
    getAllUsersController
);

export default router;