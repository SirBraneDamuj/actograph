/*
  Warnings:

  - A unique constraint covering the columns `[user_id,updated_at_serial]` on the table `user_episode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,updated_at_serial]` on the table `user_movie` will be added. If there are existing duplicate values, this will fail.
  - Made the column `updated_at_serial` on table `user_episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at_serial` on table `user_movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_episode" ALTER COLUMN "updated_at_serial" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_movie" ALTER COLUMN "updated_at_serial" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_episode_user_id_updated_at_serial_key" ON "user_episode"("user_id", "updated_at_serial");

-- CreateIndex
CREATE UNIQUE INDEX "user_movie_user_id_updated_at_serial_key" ON "user_movie"("user_id", "updated_at_serial");
