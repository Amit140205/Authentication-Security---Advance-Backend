import { Permissions, Roles } from "../generated/prisma/index.js";
import prisma from "../src/lib/prisma.js";
import { logger } from "../src/config/logger.config.js";
import { env } from "../src/config/env.config.js";
import { hashPassword } from "../src/utils/helpers/password.helper.js";

// to run:
// => add this in prisma.config.ts

// migrations: {
//     seed: "tsx prisma/seed.ts"
// },

// => npx prisma db seed

async function main() {
    await prisma.$transaction(async (tx) => {
        const permissions = [
            Permissions.MANAGE_USERS,
            Permissions.DELETE_POSTS,
            Permissions.VIEW_ANALYTICS,
            Permissions.MANAGE_ROLES,
            Permissions.CREATE_POSTS,
            Permissions.MANAGE_SETTING
        ];

        // creating permissions
        for (const permission of permissions) {
            await tx.permission.upsert({
                where: {
                    name: permission
                },
                update: {},
                create: {
                    name: permission
                }
            });
        }

        // creating super admin role
        const superAdminRole = await tx.role.upsert({
            where: {
                name: Roles.SUPER_ADMIN
            },
            update: {},
            create: {
                name: Roles.SUPER_ADMIN
            }
        });

        // fetch permissions
        const dbPermissions = await tx.permission.findMany({
            where: {
                name: {
                    in: permissions
                }
            }
        });

        // assigning permissions to admin role
        for (const permission of dbPermissions) {
            await tx.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: superAdminRole.id,
                        permissionId: permission.id
                    }
                },
                update: {},
                create: {
                    roleId: superAdminRole.id,
                    permissionId: permission.id
                }
            });
        }

        // create initial admin user
        const existingSuperAdmin = await tx.user.findUnique({
            where: {
                email: env.SUPER_ADMIN_EMAIL
            }
        });

        let superAdminUser;

        if (!existingSuperAdmin) {
            const hashedPassword = await hashPassword(env.SUPER_ADMIN_PASSWORD);

            superAdminUser = await tx.user.create({
                data: {
                    email: env.SUPER_ADMIN_EMAIL,
                    passwordHash: hashedPassword
                }
            });

            logger.info("Super Admin user created successfully");
        } else {
            superAdminUser = existingSuperAdmin;
            logger.info("Super Admin user already exists");
        }

        // assign admin role to user
        await tx.userRole.upsert({
            where: {
                userId_roleId: {
                    userId: superAdminUser.id,
                    roleId: superAdminRole.id
                }
            },
            update: {},
            create: {
                userId: superAdminUser.id,
                roleId: superAdminRole.id
            }
        });

        logger.info("Admin role assigned successfully");
    });

    logger.info("Seed completed successfully");
}

main()
    .catch((error) => {
        logger.error(`Seed error: ${error}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });