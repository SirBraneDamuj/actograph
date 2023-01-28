/*
  Warnings:

  - Added the required column `cast_order` to the `tv_episode_credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `character_name` to the `tv_episode_credit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tv_episode_credit" ADD COLUMN     "cast_order" INTEGER NOT NULL,
ADD COLUMN     "character_name" TEXT NOT NULL;
