/*
  Warnings:

  - A unique constraint covering the columns `[user_id,updated_at]` on the table `UserMovie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserMovie_user_id_updated_at_key" ON "UserMovie"("user_id", "updated_at");
