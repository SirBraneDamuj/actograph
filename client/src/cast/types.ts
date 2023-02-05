import { TvEpisode, TvShowInfo } from "../tv/types";

export type PersonMovieCredits = {
  totalCount: number;
  edges: {
    characterName: string;
    node: {
      tmdbId: string;
      title: string;
      posterPath?: string;
    };
  }[];
};
export type PersonEpisodeCredits = {
  totalCount: number;
  edges: {
    characterName: string;
    node: TvEpisode & {
      tvShow: TvShowInfo;
    };
  }[];
};

export type PersonCastEdge = {
  characterName: string;
  node: {
    tmdbId: string;
    name: string;
    profilePath: string;
    movies: PersonMovieCredits;
    episodes: PersonEpisodeCredits;
  };
};

export enum CastListType {
  ALL,
  PERSONAL,
}
