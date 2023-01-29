import { gql, useQuery } from "@apollo/client";
import { Image, Space } from "antd";
import { useParams } from "react-router-dom";
import useUserId from "../login/useUserId";
import { SeasonsTable } from "./SeasonsTable";
import { TvSeason } from "./types";

const FETCH_SHOW = gql`
  query FetchTvShow($params: FetchTvShowParams!) {
    fetchTvShow(params: $params) {
      tmdbId
      title
      posterPath
      seasons {
        seasonNumber
        numEpisodes
      }
    }
  }
`;

type TvShowDetailsProps = {
  tmdbId: string;
  title: string;
  posterPath?: string;
  seasons: TvSeason[];
};
function Details({ tmdbId, title, posterPath, seasons }: TvShowDetailsProps) {
  return (
    <Space direction="vertical">
      <h1>{title}</h1>
      <Image
        src={`https://www.themoviedb.org/t/p/w500/${posterPath}`}
        width={200}
        alt={`Poster for ${title}`}
        className="poster"
      />
      <h3>Seasons: {seasons.length}</h3>
      <SeasonsTable seasons={seasons} tvShowId={tmdbId} />
    </Space>
  );
}

export function TvShowDetails() {
  const userId = useUserId();
  const { tmdbId } = useParams();
  const { loading, data } = useQuery(FETCH_SHOW, {
    variables: {
      params: {
        tmdbId,
      },
    },
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  return <Details {...data.fetchTvShow} />;
}
