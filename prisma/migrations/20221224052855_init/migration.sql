-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "tmdbId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "poster_path" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("tmdbId")
);

-- CreateTable
CREATE TABLE "UserMovie" (
    "user_id" UUID NOT NULL,
    "movie_id" UUID NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMovie_pkey" PRIMARY KEY ("user_id","movie_id")
);
