/*
  Warnings:

  - The values [VIEWER] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permissions" ADD VALUE 'CREATE_POSTS';
ALTER TYPE "Permissions" ADD VALUE 'MANAGE_SETTING';

-- AlterEnum
BEGIN;
CREATE TYPE "Roles_new" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'MEMBER');
ALTER TABLE "Role" ALTER COLUMN "name" TYPE "Roles_new" USING ("name"::text::"Roles_new");
ALTER TYPE "Roles" RENAME TO "Roles_old";
ALTER TYPE "Roles_new" RENAME TO "Roles";
DROP TYPE "public"."Roles_old";
COMMIT;
