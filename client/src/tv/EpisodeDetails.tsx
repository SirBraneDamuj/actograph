import { gql, useQuery } from "@apollo/client";
import { Image, Space } from "antd";
import { useParams } from "react-router-dom";
import { CastList } from "../cast/CastList";
import { PersonCastEdge } from "../cast/types";
import useUserId from "../login/useUserId";
import { TvEpisode, TvShowInfo } from "./types";

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

type DetailsProps = TvEpisode & {
  tmdbId: string;
  tvShow: TvShowInfo;
  credits: PersonCastEdge[];
};

function Details({
  title,
  tmdbId,
  seasonNumber,
  episodeNumber,
  tvShow,
  credits,
}: DetailsProps) {
  const { title: showTitle, posterPath } = tvShow;
  return (
    <Space direction="vertical">
      <h1>{title}</h1>
      <h3>
        {showTitle} - Episode {seasonNumber}x{episodeNumber}
      </h3>

      <Image
        src={`https://www.themoviedb.org/t/p/w500/${posterPath}`}
        width={200}
        alt={`Poster for ${showTitle}`}
        className="poster"
      />
      <CastList cast={credits} showRelated={false} />
    </Space>
  );
}

export function EpisodeDetails() {
  useUserId();
  const { tmdbId, seasonNumber, episodeNumber } = useParams();
  const { loading, data } = useQuery(FETCH_EPISODE, {
    variables: {
      params: {
        tmdbId,
        seasonNumber: Number.parseInt(seasonNumber!),
        episodeNumber: Number.parseInt(episodeNumber!),
      },
    },
  });

  if (loading) {
    return null;
  }
  return (
    <Details
      {...data.fetchTvEpisode}
      credits={data.fetchTvEpisode.credits.edges}
    />
  );
}
