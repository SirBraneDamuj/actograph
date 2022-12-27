-- CreateTable
CREATE TABLE "MovieCredit" (
    "movie_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "character_name" TEXT NOT NULL,
    "cast_order" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieCredit_pkey" PRIMARY KEY ("movie_id","actor_id")
);

-- CreateTable
CREATE TABLE "Person" (
    "tmdb_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile_path" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("tmdb_id")
);

-- AddForeignKey
ALTER TABLE "MovieCredit" ADD CONSTRAINT "MovieCredit_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCredit" ADD CONSTRAINT "MovieCredit_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "Person"("tmdb_id") ON DELETE RESTRICT ON UPDATE CASCADE;
