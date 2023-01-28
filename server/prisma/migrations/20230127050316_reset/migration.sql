/*
  Warnings:

  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieCredit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TvEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TvEpisodeCredit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TvShow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovieCredit" DROP CONSTRAINT "MovieCredit_actor_id_fkey";

-- DropForeignKey
ALTER TABLE "MovieCredit" DROP CONSTRAINT "MovieCredit_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "TvEpisode" DROP CONSTRAINT "TvEpisode_tv_show_id_fkey";

-- DropForeignKey
ALTER TABLE "TvEpisodeCredit" DROP CONSTRAINT "TvEpisodeCredit_actor_id_fkey";

-- DropForeignKey
ALTER TABLE "TvEpisodeCredit" DROP CONSTRAINT "TvEpisodeCredit_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "UserEpisode" DROP CONSTRAINT "UserEpisode_tv_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "UserEpisode" DROP CONSTRAINT "UserEpisode_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserMovie" DROP CONSTRAINT "UserMovie_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "UserMovie" DROP CONSTRAINT "UserMovie_user_id_fkey";

-- DropTable
DROP TABLE "Movie";

-- DropTable
DROP TABLE "MovieCredit";

-- DropTable
DROP TABLE "Person";

-- DropTable
DROP TABLE "TvEpisode";

-- DropTable
DROP TABLE "TvEpisodeCredit";

-- DropTable
DROP TABLE "TvShow";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserEpisode";

-- DropTable
DROP TABLE "UserMovie";

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie" (
    "tmdb_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_cursor" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "poster_path" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_pkey" PRIMARY KEY ("tmdb_id")
);

-- CreateTable
CREATE TABLE "tv_show" (
    "tmdb_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_cursor" TEXT NOT NULL,
    "start_year" INTEGER NOT NULL,
    "end_year" INTEGER,
    "poster_path" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tv_show_pkey" PRIMARY KEY ("tmdb_id")
);

-- CreateTable
CREATE TABLE "tv_episode" (
    "id" UUID NOT NULL,
    "tv_show_id" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    "episode_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "title_cursor" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tv_episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_movie" (
    "user_id" UUID NOT NULL,
    "movie_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_movie_pkey" PRIMARY KEY ("user_id","movie_id")
);

-- CreateTable
CREATE TABLE "user_episode" (
    "user_id" UUID NOT NULL,
    "tv_episode_id" UUID NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_episode_pkey" PRIMARY KEY ("user_id","tv_episode_id")
);

-- CreateTable
CREATE TABLE "movie_credit" (
    "movie_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "character_name" TEXT NOT NULL,
    "cast_order" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_credit_pkey" PRIMARY KEY ("movie_id","actor_id")
);

-- CreateTable
CREATE TABLE "tv_episode_credit" (
    "episode_id" UUID NOT NULL,
    "actor_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tv_episode_credit_pkey" PRIMARY KEY ("episode_id","actor_id")
);

-- CreateTable
CREATE TABLE "person" (
    "tmdb_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile_path" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("tmdb_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "movie_title_cursor_key" ON "movie"("title_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "tv_show_title_cursor_key" ON "tv_show"("title_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "tv_episode_title_cursor_key" ON "tv_episode"("title_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "tv_episode_tv_show_id_season_number_episode_number_key" ON "tv_episode"("tv_show_id", "season_number", "episode_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_movie_user_id_updated_at_key" ON "user_movie"("user_id", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_episode_user_id_updated_at_key" ON "user_episode"("user_id", "updated_at");

-- AddForeignKey
ALTER TABLE "tv_episode" ADD CONSTRAINT "tv_episode_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "tv_show"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_movie" ADD CONSTRAINT "user_movie_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_movie" ADD CONSTRAINT "user_movie_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_episode" ADD CONSTRAINT "user_episode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_episode" ADD CONSTRAINT "user_episode_tv_episode_id_fkey" FOREIGN KEY ("tv_episode_id") REFERENCES "tv_episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_credit" ADD CONSTRAINT "movie_credit_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movie"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_credit" ADD CONSTRAINT "movie_credit_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "person"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tv_episode_credit" ADD CONSTRAINT "tv_episode_credit_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "tv_episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tv_episode_credit" ADD CONSTRAINT "tv_episode_credit_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "person"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;
