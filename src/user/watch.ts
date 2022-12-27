import db from "../db/index.js";
import { importMovie } from "../movie/import.js";

export async function watchMovie(userId: string, tmdbId: string) {
  const movie = await importMovie(tmdbId);
  if (!movie) {
    throw new Error(`Could not import movie with ID ${tmdbId}`);
  }
  await db.userMovie.upsert({
    create: {
      movie_id: movie.tmdbId,
      user_id: userId,
    },
    where: {
      user_id_movie_id: {
        movie_id: movie.tmdbId,
        user_id: userId,
      },
    },
    update: {},
  });
  return movie;
}
