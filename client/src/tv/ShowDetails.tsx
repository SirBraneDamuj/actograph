import { ExportOutlined } from "@ant-design/icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Collapse, Image, Space } from "antd";
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

const SET_SHOW_WATCH_STATUS = gql`
  mutation WatchTvShow($params: SetTvShowWatchStatusForUserParams!) {
    setTvShowWatchStatusForUser(params: $params) {
      tmdbId
      title
      posterPath
    }
  }
`;

type TvShowWatchButtonsProps = {
  tmdbId: string;
  userId: string;
};
function TvShowWatchButtons({ tmdbId, userId }: TvShowWatchButtonsProps) {
  const [setShowStatus, { loading }] = useMutation(SET_SHOW_WATCH_STATUS);
  function setWatchStatusHandler(watchStatus: boolean) {
    return () => {
      setShowStatus({
        variables: {
          params: {
            tmdbId,
            watched: watchStatus,
            userId,
          },
        },
      });
    };
  }
  return (
    <Space direction="horizontal">
      <Button disabled={loading} onClick={setWatchStatusHandler(true)}>
        Watch
      </Button>
      <Button disabled={loading} onClick={setWatchStatusHandler(false)}>
        Unwatch
      </Button>
    </Space>
  );
}

type TvShowDetailsProps = TvShowInfo & {
  seasons: TvSeason[];
  episodes: TvEpisode[];
  userId: string;
};
function Details(props: TvShowDetailsProps) {
  const { tmdbId, title, posterPath, seasons, episodes, userId } = props;
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
      <h1>
        {title} <TvShowWatchButtons tmdbId={tmdbId} userId={userId} />
      </h1>
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
  const userId = useUserId();
  const { tmdbId } = useParams();
  const { loading, data } = useQuery(FETCH_SHOW, {
    variables: {
      params: {
        tmdbId,
      },
    },
  });
  if (loading || !userId) {
    return <div>Loading...</div>;
  }
  const detailsProps = {
    ...data.fetchTvShow,
    episodes: data.fetchTvShow.episodes.edges.map(
      (episodeEdge: { node: TvEpisode }) => episodeEdge.node
    ),
    userId,
  };
  return <Details {...detailsProps} />;
}
