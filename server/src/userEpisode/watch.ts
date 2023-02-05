import { v4 as uuidv4 } from "uuid";
import db from "../db/index.js";

import { importTvShow } from "../tvEpisode/import.js";
export async function unwatchEpisode(userId: string, episodeId: string) {
  await db.userEpisode.delete({
    where: {
      user_id_tv_episode_id: {
        user_id: userId,
        tv_episode_id: episodeId,
      },
    },
  });
}

export async function unwatchShow(userId: string, tmdbId: string) {
  await db.$executeRaw`DELETE FROM user_episode ue USING tv_episode te WHERE te.tv_show_id=${tmdbId} AND ue.user_id=${userId}::uuid;`;
}

export async function watchShow(userId: string, tmdbId: string) {
  const show = await importTvShow(tmdbId);
  if (!show) {
    throw new Error(`Could not import show with ID ${tmdbId}`);
  }
  const showWithEpisodes = await db.tvShow.findUnique({
    where: {
      tmdb_id: tmdbId,
    },
    include: {
      episodes: true,
    },
  });
  if (!showWithEpisodes) {
    throw new Error(`Could not import show with ID ${tmdbId}`);
  }
  const { episodes } = showWithEpisodes;
  await db.$transaction(async (tx) => {
    for (const { id } of episodes) {
      const timestamp = new Date();
      await tx.userEpisode.upsert({
        create: {
          tv_episode_id: id,
          user_id: userId,
          updated_at: timestamp,
          updated_at_serial: `${timestamp.toISOString()}_${uuidv4()}`,
        },
        where: {
          user_id_tv_episode_id: {
            tv_episode_id: id,
            user_id: userId,
          },
        },
        update: {},
      });
    }
  });
  return show;
}
