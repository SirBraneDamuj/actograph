-- CreateTable
CREATE TABLE "tv_season" (
    "id" UUID NOT NULL,
    "tv_show_id" TEXT NOT NULL,
    "season_number" INTEGER NOT NULL,
    "num_episodes" INTEGER NOT NULL,

    CONSTRAINT "tv_season_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tv_season_tv_show_id_season_number_key" ON "tv_season"("tv_show_id", "season_number");

-- AddForeignKey
ALTER TABLE "tv_season" ADD CONSTRAINT "tv_season_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "tv_show"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;
