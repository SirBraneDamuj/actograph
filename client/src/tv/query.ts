import { gql, useQuery } from "@apollo/client";
import { PersonCastEdge } from "../cast/types";
import { TvShowInfo } from "./types";

export type FetchEpisodeResponse = {
  fetchTvEpisode: {
    id: string;
    title: string;
    tmdbId: string;
    seasonNumber: number;
    episodeNumber: number;
    tvShow: TvShowInfo;
    credits: {
      edges: PersonCastEdge[];
    };
  };
};

const FETCH_EPISODE = gql`
  query FetchTvEpisode($params: FetchTvEpisodeParams!) {
    fetchTvEpisode(params: $params) {
      id
      title
      tmdbId
      seasonNumber
      episodeNumber
      tvShow {
        title
        posterPath
      }
      credits {
        edges {
          characterName
          node {
            tmdbId
            name
            profilePath
          }
        }
      }
    }
  }
`;

export function useFetchEpisode(
  tmdbId: string,
  seasonNumber: number,
  episodeNumber: number
) {
  return useQuery<FetchEpisodeResponse>(FETCH_EPISODE, {
    variables: {
      params: {
        tmdbId,
        seasonNumber,
        episodeNumber,
      },
    },
  });
}

const FETCH_EPISODE_WITH_PERSONAL_CREDITS = gql`
  query FetchTvEpisode(
    $params: FetchTvEpisodeParams!
    $creditsParams: PersonalizedCreditConnectionParams
  ) {
    fetchTvEpisode(params: $params) {
      id
      title
      tmdbId
      seasonNumber
      episodeNumber
      tvShow {
        tmdbId
        title
        posterPath
      }
      credits {
        edges {
          characterName
          node {
            tmdbId
            name
            profilePath
            movies(params: $creditsParams) {
              edges {
                characterName
                node {
                  tmdbId
                  title
                  posterPath
                }
              }
            }
            episodes(params: $creditsParams) {
              edges {
                characterName
                node {
                  tmdbId
                  title
                  tvShow {
                    tmdbId
                    title
                    posterPath
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export type EpisodeWithPersonalizedCreditsParams = {
  tmdbId: string;
  seasonNumber: number;
  episodeNumber: number;
  userId: string;
};
export function useFetchEpisodeWithPersonalizedCredits({
  tmdbId,
  seasonNumber,
  episodeNumber,
  userId,
}: EpisodeWithPersonalizedCreditsParams) {
  return useQuery<FetchEpisodeResponse>(FETCH_EPISODE_WITH_PERSONAL_CREDITS, {
    variables: {
      params: {
        tmdbId,
        seasonNumber,
        episodeNumber,
      },
      creditsParams: {
        userId,
        exceptTvShow: tmdbId,
      },
    },
  });
}
