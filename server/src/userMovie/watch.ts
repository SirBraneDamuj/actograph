import { v4 as uuidv4 } from "uuid";
import db from "../db/index.js";
import { importMovie } from "../movie/import.js";

export async function unwatchMovie(userId: string, tmdbId: string) {
  await db.userMovie.delete({
    where: {
      user_id_movie_id: {
        user_id: userId,
        movie_id: tmdbId,
      },
    },
  });
}

export async function watchMovie(userId: string, tmdbId: string) {
  const movie = await importMovie(tmdbId);
  if (!movie) {
    throw new Error(`Could not import movie with ID ${tmdbId}`);
  }
  const timestamp = new Date();
  await db.userMovie.upsert({
    create: {
      movie_id: movie.tmdb_id,
      user_id: userId,
      updated_at: timestamp,
      updated_at_serial: `${timestamp.toISOString()}_${uuidv4()}`,
    },
    where: {
      user_id_movie_id: {
        movie_id: movie.tmdb_id,
        user_id: userId,
      },
    },
    update: {},
  });
  return movie;
}
