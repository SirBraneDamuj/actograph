import { Image, Space, Switch } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { CastList } from "../cast/CastList";
import { CastListType } from "../cast/types";
import useUserId from "../login/useUserId";
import { useFetchEpisode } from "./query";

type DetailsProps = {
  tmdbId: string;
  seasonNumber: number;
  episodeNumber: number;
};

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
  const { title, tvShow, credits } = fetchTvEpisode;
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
      <CastList cast={credits.edges} showRelated={false} />
    </Space>
  );
}

export function EpisodeDetails() {
  useUserId();
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
    switch (castListType) {
      case CastListType.ALL:
        return (
          <Details
            tmdbId={tmdbId!}
            episodeNumber={Number.parseInt(episodeNumber!)}
            seasonNumber={Number.parseInt(seasonNumber!)}
          />
        );
      case CastListType.PERSONAL:
        return null;
    }
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
