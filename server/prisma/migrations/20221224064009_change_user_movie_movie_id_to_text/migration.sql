/*
  Warnings:

  - The primary key for the `UserMovie` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UserMovie" DROP CONSTRAINT "UserMovie_pkey",
ALTER COLUMN "movie_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserMovie_pkey" PRIMARY KEY ("user_id", "movie_id");
