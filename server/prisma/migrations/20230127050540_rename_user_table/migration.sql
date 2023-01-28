/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_episode" DROP CONSTRAINT "user_episode_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_movie" DROP CONSTRAINT "user_movie_user_id_fkey";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "actograph_user" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actograph_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "actograph_user_username_key" ON "actograph_user"("username");

-- AddForeignKey
ALTER TABLE "user_movie" ADD CONSTRAINT "user_movie_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "actograph_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_episode" ADD CONSTRAINT "user_episode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "actograph_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
