import { gql, useMutation, useQuery } from "@apollo/client";
import { Image, Space, Switch } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { CastList } from "../cast/CastList";
import { CastListType, PersonCastEdge } from "../cast/types";
import useUserId from "../login/useUserId";
import {
  useFetchEpisode,
  useFetchEpisodeWithPersonalizedCredits,
} from "./query";

type DetailsProps = {
  tmdbId: string;
  seasonNumber: number;
  episodeNumber: number;
};

type BaseCardProps = {
  episodeId: string;
  title: string;
  showTitle: string;
  seasonNumber: number;
  episodeNumber: number;
  posterPath?: string;
  credits: PersonCastEdge[];
  showRelated?: boolean;
};
function BaseCard({
  episodeId,
  title,
  showTitle,
  seasonNumber,
  episodeNumber,
  posterPath,
  credits,
  showRelated = false,
}: BaseCardProps) {
  return (
    <Space direction="vertical">
      <h1>
        {title}
        <WatchedEpisodeToggle episodeId={episodeId} />
      </h1>
      <h3>
        {showTitle} - Episode {seasonNumber}x{episodeNumber}
      </h3>

      <Image
        src={`https://www.themoviedb.org/t/p/w500/${posterPath}`}
        width={200}
        alt={`Poster for ${showTitle}`}
        className="poster"
      />
      <CastList cast={credits} showRelated={showRelated} />
    </Space>
  );
}

function Details({ tmdbId, seasonNumber, episodeNumber }: DetailsProps) {
  const { loading, data } = useFetchEpisode(
    tmdbId,
    seasonNumber,
    episodeNumber
  );

  if (loading) {
    return null;
  }
  const { fetchTvEpisode } = data!;
  const { id, title, tvShow, credits } = fetchTvEpisode;
  const { title: showTitle, posterPath } = tvShow;
  return (
    <BaseCard
      episodeId={id}
      seasonNumber={seasonNumber}
      episodeNumber={episodeNumber}
      title={title}
      showTitle={showTitle}
      posterPath={posterPath}
      credits={credits.edges}
    />
  );
}

type PersonalizedDetailsProps = {
  tmdbId: string;
  seasonNumber: number;
  episodeNumber: number;
  userId: string;
};
function PersonalizedDetails(props: PersonalizedDetailsProps) {
  const { seasonNumber, episodeNumber } = props;
  const { loading, data } = useFetchEpisodeWithPersonalizedCredits(props);

  if (loading) {
    return null;
  }
  const { fetchTvEpisode } = data!;
  const { id, title, tvShow, credits } = fetchTvEpisode;
  const { title: showTitle, posterPath } = tvShow;
  return (
    <BaseCard
      episodeId={id}
      showRelated={true}
      seasonNumber={seasonNumber}
      episodeNumber={episodeNumber}
      title={title}
      showTitle={showTitle}
      posterPath={posterPath}
      credits={credits.edges}
    />
  );
}

const WATCHED_STATS = gql`
  query FetchWatchedEpisodeForUser($params: FetchWatchedTvEpisodeParams!) {
    fetchWatchedEpisode(params: $params) {
      node {
        tmdbId
        title
      }
      watchTimestamp
    }
  }
`;

const SET_WATCHED_STATUS = gql`
  mutation SetTvEpisodeWatchForUser(
    $params: SetTvEpisodeWatchStatusForUserParams!
  ) {
    setTvEpisodeWatchStatusForUser(params: $params) {
      tmdbId
    }
  }
`;

function WatchedEpisodeToggle({ episodeId }: { episodeId: string }) {
  const userId = useUserId();
  const {
    loading: statusLoading,
    data: statusData,
    refetch: statusRefetch,
  } = useQuery(WATCHED_STATS, {
    variables: {
      params: {
        id: episodeId,
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
  const watchTimestamp = statusData?.fetchWatchedEpisode?.watchTimestamp;
  async function toggleEpisodeWatch() {
    await toggleWatchedMutation({
      variables: {
        params: {
          id: episodeId,
          userId,
          watched: !watchTimestamp,
        },
      },
    });
    statusRefetch();
  }
  console.log(watchTimestamp, !!watchTimestamp);
  return (
    <Switch
      checked={!!watchTimestamp}
      checkedChildren={"Watched"}
      unCheckedChildren={"Not Watched"}
      onChange={toggleEpisodeWatch}
    />
  );
}

export function EpisodeDetails() {
  const userId = useUserId();
  const { tmdbId, seasonNumber, episodeNumber } = useParams();

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
  function castList() {
    const props = {
      tmdbId: tmdbId!,
      episodeNumber: Number.parseInt(episodeNumber!),
      seasonNumber: Number.parseInt(seasonNumber!),
    };
    switch (castListType) {
      case CastListType.ALL:
        return <Details {...props} />;
      case CastListType.PERSONAL:
        return <PersonalizedDetails {...props} userId={userId!} />;
    }
  }
  if (!userId) {
    return null;
  }
  return (
    <Space direction="vertical">
      <Space>
        Mode:
        <Switch
          checked={castListType === CastListType.PERSONAL}
          checkedChildren={"Personalized"}
          unCheckedChildren={"All"}
          onChange={toggleCastListType}
        />
      </Space>
      {castList()}
    </Space>
  );
}
