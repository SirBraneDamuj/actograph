import { gql, useMutation, useQuery } from "@apollo/client";
import { Image, Space, Switch } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { CastList } from "../cast/CastList";
import { CastListType } from "../cast/types";
import useUserId from "../login/useUserId";

const WATCHED_STATS = gql`
  query FetchMovieWatchForUser($params: FetchWatchedMovieParams!) {
    fetchWatchedMovie(params: $params) {
      node {
        tmdbId
        title
      }
      watchTimestamp
    }
  }
`;

const SET_WATCHED_STATUS = gql`
  mutation SetMovieWatchForUser($params: SetWatchStatusForUserParams!) {
    setWatchStatusForUser(params: $params) {
      tmdbId
    }
  }
`;

const FETCH_MOVIE_WITH_CAST = gql`
  query FetchMovie($params: FetchMovieParams!) {
    fetchMovie(params: $params) {
      tmdbId
      title
      posterPath
      credits {
        totalCount
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

const FETCH_MOVIE_WITH_PERSONALIZED_CAST = gql`
  query FetchMovieWithPersonalizedCast(
    $params: FetchMovieParams!
    $creditsParams: PersonalizedCreditConnectionParams
  ) {
    fetchMovie(params: $params) {
      tmdbId
      title
      posterPath
      credits {
        totalCount
        edges {
          characterName
          node {
            tmdbId
            name
            profilePath
            movies(params: $creditsParams) {
              totalCount
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
              totalCount
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

type BaseMovieDetailsProps = {
  tmdbId: string;
  title: string;
  posterPath: string | null;
  totalCredits: number;
};
type RegularMovieDetailsProps = {
  tmdbId: string;
};

type PersonalizedMovieDetailsProps = {
  tmdbId: string;
  userId: string;
};

function WatchedMovieToggle({ tmdbId }: { tmdbId: string }) {
  const userId = useUserId();
  const {
    loading: statusLoading,
    data: statusData,
    refetch: statusRefetch,
  } = useQuery(WATCHED_STATS, {
    variables: {
      params: {
        tmdbId,
        userId,
      },
    },
    skip: !userId,
  });
  const [toggleWatchedMutation, { loading: toggleLoading }] =
    useMutation(SET_WATCHED_STATUS);
  if (statusLoading || toggleLoading) {
    return null;
  }
  const watchTimestamp = statusData?.fetchWatchedMovie?.watchTimestamp;
  async function toggleMovieWatch() {
    await toggleWatchedMutation({
      variables: {
        params: {
          tmdbId,
          userId,
          watched: !watchTimestamp,
        },
      },
    });
    statusRefetch();
  }
  return (
    <Switch
      checked={!!watchTimestamp}
      checkedChildren={"Watched"}
      unCheckedChildren={"Not Watched"}
      onChange={toggleMovieWatch}
    />
  );
}

function BaseMovieDetails({
  tmdbId,
  title,
  posterPath,
  totalCredits,
}: BaseMovieDetailsProps) {
  return (
    <>
      <h1>
        {title}
        <WatchedMovieToggle tmdbId={tmdbId} />
      </h1>
      <Image
        src={`https://www.themoviedb.org/t/p/w500/${posterPath}`}
        width={200}
        alt={`Poster for ${title}`}
        className="poster"
      />
      <h3>Credits: {totalCredits}</h3>
    </>
  );
}

function PersonalizedMovieDetails({
  tmdbId,
  userId,
}: PersonalizedMovieDetailsProps) {
  const { loading, data } = useQuery(FETCH_MOVIE_WITH_PERSONALIZED_CAST, {
    variables: {
      params: {
        tmdbId,
      },
      creditsParams: {
        userId,
        exceptMovie: tmdbId,
      },
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Space direction="vertical">
      <BaseMovieDetails
        tmdbId={data.fetchMovie.tmdbId}
        title={data.fetchMovie.title}
        posterPath={data.fetchMovie.posterPath}
        totalCredits={data.fetchMovie.credits.totalCount}
      />
      <CastList showRelated cast={data.fetchMovie.credits.edges} />
    </Space>
  );
}

function RegularMovieDetails({ tmdbId }: RegularMovieDetailsProps) {
  const { loading, data } = useQuery(FETCH_MOVIE_WITH_CAST, {
    variables: {
      params: {
        tmdbId,
      },
    },
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Space direction="vertical">
      <BaseMovieDetails
        tmdbId={data.fetchMovie.tmdbId}
        title={data.fetchMovie.title}
        posterPath={data.fetchMovie.posterPath}
        totalCredits={data.fetchMovie.credits.totalCount}
      />
      <CastList showRelated={false} cast={data.fetchMovie.credits.edges} />
    </Space>
  );
}

export function MovieDetails() {
  const userId = useUserId();
  const { tmdbId } = useParams();
  const [castListType, setCastListType] = useState<CastListType>(
    CastListType.ALL
  );
  function toggleCastListType() {
    setCastListType(
      castListType === CastListType.PERSONAL
        ? CastListType.ALL
        : CastListType.PERSONAL
    );
  }
  function castList(tmdbId: string, userId: string) {
    switch (castListType) {
      case CastListType.ALL:
        return <RegularMovieDetails tmdbId={tmdbId} />;
      case CastListType.PERSONAL:
        return <PersonalizedMovieDetails userId={userId} tmdbId={tmdbId} />;
    }
  }
  if (!tmdbId) return null;
  if (!userId) return null;
  return (
    <Space direction={"vertical"}>
      <Space>
        Mode:
        <Switch
          checked={castListType === CastListType.PERSONAL}
          checkedChildren={"Personalized"}
          unCheckedChildren={"All"}
          onChange={toggleCastListType}
        />
      </Space>
      {castList(tmdbId, userId)}
    </Space>
  );
}
