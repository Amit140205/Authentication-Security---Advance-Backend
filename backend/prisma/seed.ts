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
            Permissions.MANAGE_ROLES
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

        // creating admin role
        const adminRole = await tx.role.upsert({
            where: {
                name: Roles.ADMIN
            },
            update: {},
            create: {
                name: Roles.ADMIN
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
                        roleId: adminRole.id,
                        permissionId: permission.id
                    }
                },
                update: {},
                create: {
                    roleId: adminRole.id,
                    permissionId: permission.id
                }
            });
        }

        // create initial admin user
        const existingAdmin = await tx.user.findUnique({
            where: {
                email: env.ADMIN_EMAIL
            }
        });

        let adminUser;

        if (!existingAdmin) {
            const hashedPassword = await hashPassword(env.ADMIN_PASSWORD);

            adminUser = await tx.user.create({
                data: {
                    email: env.ADMIN_EMAIL,
                    passwordHash: hashedPassword
                }
            });

            logger.info("Admin user created successfully");
        } else {
            adminUser = existingAdmin;
            logger.info("Admin user already exists");
        }

        // assign admin role to user
        await tx.userRole.upsert({
            where: {
                userId_roleId: {
                    userId: adminUser.id,
                    roleId: adminRole.id
                }
            },
            update: {},
            create: {
                userId: adminUser.id,
                roleId: adminRole.id
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