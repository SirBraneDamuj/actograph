-- CreateTable
CREATE TABLE "TvShow" (
    "tmdb_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_cursor" TEXT NOT NULL,
    "start_year" INTEGER NOT NULL,
    "end_year" INTEGER,
    "poster_path" TEXT,

    CONSTRAINT "TvShow_pkey" PRIMARY KEY ("tmdb_id")
);

-- CreateTable
CREATE TABLE "TvEpisode" (
    "tmdb_id" TEXT NOT NULL,
    "tv_show_id" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    "episode_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "title_cursor" TEXT NOT NULL,

    CONSTRAINT "TvEpisode_pkey" PRIMARY KEY ("tmdb_id")
);

-- CreateTable
CREATE TABLE "TvEpisodeCredit" (
    "episode_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,

    CONSTRAINT "TvEpisodeCredit_pkey" PRIMARY KEY ("episode_id","actor_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TvShow_title_cursor_key" ON "TvShow"("title_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "TvEpisode_title_cursor_key" ON "TvEpisode"("title_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "TvEpisode_tv_show_id_season_number_episode_number_key" ON "TvEpisode"("tv_show_id", "season_number", "episode_number");

-- AddForeignKey
ALTER TABLE "TvEpisode" ADD CONSTRAINT "TvEpisode_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "TvShow"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TvEpisodeCredit" ADD CONSTRAINT "TvEpisodeCredit_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "TvEpisode"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TvEpisodeCredit" ADD CONSTRAINT "TvEpisodeCredit_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "Person"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;
