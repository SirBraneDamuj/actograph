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
