import express from "express";
import {
    getUserRolesAndPermissions,
    loggedInUserController,
    loginUserController,
    logoutAllController,
    logoutController, 
    refreshSessionController, 
    registerUserController
} from "./auth.controller.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { validate } from "../../utils/middlewares/validate.middleware.js";
import { authenticationMiddleware } from "../../utils/middlewares/authentication.middleware.js";

const router = express.Router();

router.route("/register").post(validate(registerUserSchema), registerUserController);

router.route("/login").post(validate(loginUserSchema), loginUserController);

router.route("/me").get(authenticationMiddleware, loggedInUserController);

router.route("/refresh-token").post(refreshSessionController);

router.route("/logout").post(logoutController);

router.route("/logout-all-devices").post(authenticationMiddleware, logoutAllController);

// RBAC
router.route("/me/roles-permissions").get(authenticationMiddleware, getUserRolesAndPermissions);

export default router;