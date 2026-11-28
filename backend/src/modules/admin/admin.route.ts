import express from "express";
import { authenticationMiddleware } from "../../utils/middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../utils/middlewares/authorization.middleware.js";
import { Permissions } from "../../../generated/prisma/index.js";
import { createRoleWithPermissionsController, getAllRolesController, getAllUsersController, getRoleByRoleIdController, updateRolePermissionsController } from "./admin.controller.js";
import { validate } from "../../utils/middlewares/validate.middleware.js";
import { createRoleSchema, roleIdParamsSchema, updateRolePermissionsSchema,  } from "./admin.schema.js";

const router = express.Router();

router.route("/all-users").get(
    authenticationMiddleware,
    authorizationMiddleware([Permissions.MANAGE_USERS]),
    getAllUsersController
);

router.route("/all-roles").get(
    authenticationMiddleware,
    authorizationMiddleware([Permissions.MANAGE_ROLES]),
    getAllRolesController
);

router.route("/roles/:roleId").get(
    authenticationMiddleware,
    authorizationMiddleware([Permissions.MANAGE_ROLES]),
    validate(roleIdParamsSchema, "params"),
    getRoleByRoleIdController
);

router.route("/create-role").post(
    authenticationMiddleware,
    authorizationMiddleware([Permissions.MANAGE_ROLES]),
    validate(createRoleSchema, "body"),
    createRoleWithPermissionsController
);

router.route("/update-role-permissions/:roleId").patch(
    authenticationMiddleware,
    authorizationMiddleware([Permissions.MANAGE_ROLES]),
    validate(roleIdParamsSchema, "params"),
    validate(updateRolePermissionsSchema, "body"),
    updateRolePermissionsController
)

export default router;