import { gql, useQuery } from "@apollo/client";
import { Image, Space } from "antd";
import { useParams } from "react-router-dom";
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
    }
  }
`;

type DetailsProps = TvEpisode & {
  tmdbId: string;
  tvShow: TvShowInfo;
};

function Details({
  title,
  tmdbId,
  seasonNumber,
  episodeNumber,
  tvShow,
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
  return <Details {...data.fetchTvEpisode} />;
}
