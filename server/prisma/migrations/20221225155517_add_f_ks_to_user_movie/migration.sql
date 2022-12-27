-- AddForeignKey
ALTER TABLE "UserMovie" ADD CONSTRAINT "UserMovie_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMovie" ADD CONSTRAINT "UserMovie_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;
