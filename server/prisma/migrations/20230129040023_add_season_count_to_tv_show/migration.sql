/*
  Warnings:

  - Added the required column `num_seasons` to the `tv_show` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tv_show" ADD COLUMN     "num_seasons" INTEGER NOT NULL;
