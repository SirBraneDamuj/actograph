/*
  Warnings:

  - A unique constraint covering the columns `[title_cursor]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title_cursor` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "title_cursor" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_title_cursor_key" ON "Movie"("title_cursor");
