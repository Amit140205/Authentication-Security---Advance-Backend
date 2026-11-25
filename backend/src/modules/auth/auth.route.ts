import express from "express";
import { loggedInUserController, loginUserController, registerUserController } from "./auth.controller.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { validate } from "../../utils/middlewares/validate.middleware.js";
import { verifyUser } from "../../utils/middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(validate(registerUserSchema), registerUserController);

router.route("/login").post(validate(loginUserSchema), loginUserController);

router.route("/me").get(verifyUser, loggedInUserController);

export default router;