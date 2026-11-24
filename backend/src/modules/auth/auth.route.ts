import express from "express";
import { registerUserController } from "./auth.controller.js";
import { registerUserSchema } from "./auth.schema.js";
import { validate } from "../../utils/middlewares/validate.middleware.js";

const router = express.Router();

router.route("/register").post(validate(registerUserSchema), registerUserController);

export default router;