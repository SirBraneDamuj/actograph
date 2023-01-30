import { ExportOutlined } from "@ant-design/icons";
import { gql, useQuery } from "@apollo/client";
import { Collapse, Image, Space } from "antd";
import { useParams } from "react-router-dom";
import useUserId from "../login/useUserId";
import { SeasonDetails } from "./SeasonsTable";
import { TvEpisode, TvSeason, TvShowInfo } from "./types";

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
      episodes {
        totalCount
        edges {
          cursor
          node {
            id
            title
            seasonNumber
            episodeNumber
          }
        }
      }
    }
  }
`;

type TvShowDetailsProps = TvShowInfo & {
  seasons: TvSeason[];
  episodes: TvEpisode[];
};
function Details(props: TvShowDetailsProps) {
  const { tmdbId, title, posterPath, seasons, episodes } = props;
  function seasonCards() {
    return seasons.map((season) => {
      const seasonEpisodes = episodes.filter(
        (episode) => episode.seasonNumber === season.seasonNumber
      );
      return (
        <Collapse.Panel
          key={season.seasonNumber}
          header={`Season ${season.seasonNumber}`}
        >
          <SeasonDetails
            tvShow={props}
            season={season}
            episodes={seasonEpisodes}
          />
        </Collapse.Panel>
      );
    });
  }
  return (
    <Space direction="vertical">
      <h1>{title}</h1>
      <a
        href={`https://www.themoviedb.org/tv/${tmdbId}`}
        target={"_blank"}
        rel="noreferrer"
      >
        View on TMDB <ExportOutlined />
      </a>
      <Image
        src={`https://www.themoviedb.org/t/p/w500/${posterPath}`}
        width={200}
        alt={`Poster for ${title}`}
        className="poster"
      />
      <h3>Seasons: {seasons.length}</h3>
      <Collapse accordion>{seasonCards()}</Collapse>
    </Space>
  );
}

export function TvShowDetails() {
  useUserId();
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
  const detailsProps = {
    ...data.fetchTvShow,
    episodes: data.fetchTvShow.episodes.edges.map(
      (episodeEdge: { node: TvEpisode }) => episodeEdge.node
    ),
  };
  return <Details {...detailsProps} />;
}
