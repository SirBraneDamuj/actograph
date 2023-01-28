import { TvShow } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import db from "../db/index.js";
import Tmdb from "../tmdb.js";

export async function importTvShow(tmdbId: string): Promise<TvShow | null> {
  const existingTvShow = await db.tvShow.findUnique({
    where: {
      tmdb_id: tmdbId,
    },
  });
  if (existingTvShow) {
    return existingTvShow;
  }
  const loadedTv = await Tmdb.tvInfo(tmdbId);
  if (!loadedTv.id) {
    return null;
  }
  const seasons = loadedTv.seasons!.filter(
    (season) => season.season_number! > 0,
  );
  const loadedSeasons = await Promise.all(
    seasons.flatMap(({ season_number, episode_count }) => {
      const episodes = [...Array(episode_count!).keys()];
      return episodes.map(async (n) => {
        const params = {
          id: tmdbId,
          season_number: season_number!,
          episode_number: n + 1,
        };
        const details = await Tmdb.episodeInfo(params);
        const credits = await Tmdb.episodeCredits(params);
        return {
          ...params,
          credits,
          details,
        };
      });
    }),
  );
  const title = loadedTv.name!;
  const startYear = new Date(loadedTv.first_air_date!).getFullYear();
  const endYear = loadedTv.last_air_date
    ? new Date(loadedTv.last_air_date).getFullYear()
    : null;
  const tvShow = db.tvShow.create({
    data: {
      tmdb_id: tmdbId,
      title,
      title_cursor: `${title}_${startYear}_${uuidv4()}`,
      start_year: startYear,
      end_year: endYear,
      poster_path: loadedTv.poster_path,
      episodes: {
        create: loadedSeasons.map(
          ({ season_number, episode_number, credits, details }) => {
            const title = details.name!;
            const airDate = details.air_date
              ? new Date(details.air_date)
              : null;
            const year = airDate?.getFullYear() || 0;
            const castCredits = credits.cast!.map((castMember, order) => {
              return {
                character_name: castMember.character!,
                cast_order: order + 1 || 999,
                person: {
                  tmdb_id: castMember.id!.toString(),
                  name: castMember.name!,
                  profile_path: castMember.profile_path,
                },
              };
            });
            const guestCredits =
              credits.guest_stars?.map((castMember, order) => {
                return {
                  character_name: castMember.character!,
                  cast_order: order + 1 + castCredits.length || 999,
                  person: {
                    tmdb_id: castMember.id!.toString(),
                    name: castMember.name!,
                    profile_path: castMember.profile_path,
                  },
                };
              }) || [];
            const allCredits = [...castCredits, ...guestCredits];

            return {
              tv_show_id: tmdbId,
              season_number,
              episode_number,
              title,
              title_cursor: `${title}_${year}_${uuidv4()}`,
              credits: {
                create: allCredits.map((credit) => {
                  return {
                    character_name: credit.character_name,
                    cast_order: credit.cast_order,
                    actor: {
                      connectOrCreate: {
                        where: { tmdb_id: credit.person.tmdb_id },
                        create: {
                          tmdb_id: credit.person.tmdb_id,
                          name: credit.person.name,
                          profile_path: credit.person.profile_path,
                        },
                      },
                    },
                  };
                }),
              },
            };
          },
        ),
      },
    },
  });
  return tvShow;
}
