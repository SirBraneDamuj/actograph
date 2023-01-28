/*
  Warnings:

  - The primary key for the `TvEpisode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tmdb_id` on the `TvEpisode` table. All the data in the column will be lost.
  - Added the required column `id` to the `TvEpisode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TvEpisodeCredit" DROP CONSTRAINT "TvEpisodeCredit_episode_id_fkey";

-- AlterTable
ALTER TABLE "TvEpisode" DROP CONSTRAINT "TvEpisode_pkey",
DROP COLUMN "tmdb_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "TvEpisode_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "UserEpisode" (
    "user_id" UUID NOT NULL,
    "tv_episode_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserEpisode_pkey" PRIMARY KEY ("user_id","tv_episode_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserEpisode_user_id_updated_at_key" ON "UserEpisode"("user_id", "updated_at");

-- AddForeignKey
ALTER TABLE "UserEpisode" ADD CONSTRAINT "UserEpisode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEpisode" ADD CONSTRAINT "UserEpisode_tv_episode_id_fkey" FOREIGN KEY ("tv_episode_id") REFERENCES "TvEpisode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TvEpisodeCredit" ADD CONSTRAINT "TvEpisodeCredit_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "TvEpisode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
