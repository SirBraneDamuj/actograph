import { TvShow } from "@prisma/client";
import { EpisodeCreditsResponse } from "moviedb-promise";
import { v4 as uuidv4 } from "uuid";
import db from "../db/index.js";
import Tmdb from "../tmdb.js";

type EpisodeCredit = {
  character: string;
  order: number;
  person: {
    tmdbId: string;
    name: string;
    profilePath?: string;
  };
};
function consolidateCastList(
  creditsResponse: EpisodeCreditsResponse,
): EpisodeCredit[] {
  const castCredits = creditsResponse.cast!.map((castMember, order) => {
    return {
      character: castMember.character!,
      order: order + 1 || 999,
      person: {
        tmdbId: castMember.id!.toString(),
        name: castMember.name!,
        profilePath: castMember.profile_path || undefined,
      },
    };
  });
  const guestCredits =
    creditsResponse.guest_stars?.map((castMember, order) => {
      return {
        character: castMember.character!,
        order: order + 1 + castCredits.length || 999,
        person: {
          tmdbId: castMember.id!.toString(),
          name: castMember.name!,
          profilePath: castMember.profile_path || undefined,
        },
      };
    }) || [];
  const allCredits = [...castCredits, ...guestCredits].reduce(
    (acc, current) => {
      const prev = acc[current.person.tmdbId];
      acc[current.person.tmdbId] = prev
        ? {
            ...prev,
            character: `${prev.character} | ${current.character}`,
          }
        : current;
      return acc;
    },
    {} as { [actorId: string]: EpisodeCredit },
  );
  return Object.keys(allCredits).map((k) => allCredits[k]);
}

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
  console.log("----------------LOADING TV SHOW");
  return db.tvShow.create({
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
            const allCredits = consolidateCastList(credits);

            return {
              season_number,
              episode_number,
              title,
              title_cursor: `${title}_${year}_${uuidv4()}`,
              credits: {
                create: allCredits.map((credit) => {
                  return {
                    character_name: credit.character,
                    cast_order: credit.order,
                    actor: {
                      connectOrCreate: {
                        where: { tmdb_id: credit.person.tmdbId },
                        create: {
                          tmdb_id: credit.person.tmdbId,
                          name: credit.person.name,
                          profile_path: credit.person.profilePath,
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
}
