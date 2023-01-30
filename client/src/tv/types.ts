export type TvShowInfo = {
  tmdbId: string;
  title: string;
  posterPath?: string;
};

export type TvSeason = {
  seasonNumber: number;
  numEpisodes: number;
};

export type TvEpisode = {
  id: string;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
};
