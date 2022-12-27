import { Movie } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import db from "../db/index.js";
import Tmdb from "../tmdb.js";

export async function importMovie(tmdbId: string): Promise<Movie | null> {
  const existingMovie = await db.movie.findUnique({
    where: {
      tmdbId,
    },
  });
  if (existingMovie) {
    return existingMovie;
  }
  const loadedMovie = await Tmdb.movieInfo(tmdbId);
  if (!loadedMovie.id) {
    return null;
  }
  const movieCredits = (await Tmdb.movieCredits(tmdbId)).cast; // TODO: how can I more safely handle these responses
  if (!movieCredits) {
    return null;
  }
  const title = loadedMovie.title || "Somehow this doesn't have a title"; // TODO: how can I more safely handle these responses
  const year = loadedMovie.release_date
    ? new Date(loadedMovie.release_date).getFullYear()
    : 0;
  const newMovie = await db.movie.create({
    data: {
      tmdbId: loadedMovie.id.toString(),
      title,
      title_cursor: `${title}_${year}_${uuidv4()}`,
      poster_path: loadedMovie.poster_path,
      year,
      credits: {
        create: movieCredits.map((cast) => ({
          character_name: cast.character || "N/A",
          cast_order: cast.order || 999,
          actor: {
            connectOrCreate: {
              where: { tmdb_id: cast.id!.toString() },
              create: {
                tmdb_id: cast.id!.toString(),
                name: cast.name!,
                profile_path: cast.profile_path,
              },
            },
          },
        })),
      },
    },
  });
  return newMovie;
}
