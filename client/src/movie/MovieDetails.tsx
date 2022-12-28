import { gql, useQuery } from "@apollo/client";
import { Image, Switch } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { CastList } from "../cast/CastList";
import useUserId from "../login/useUserId";

const FETCH_MOVIE = gql`
  query FetchMovie(
    $params: FetchMovieParams!
    $creditsParams: MovieCreditsParams
  ) {
    fetchMovie(params: $params) {
      tmdbId
      title
      posterPath
      credits(params: $creditsParams) {
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

enum CastListType {
  ALL,
  PERSONAL,
}

export function MovieDetails() {
  const userId = useUserId();
  const { tmdbId } = useParams();
  const [castListType, setCastListType] = useState<CastListType>(
    CastListType.ALL
  );
  const { loading, data } = useQuery(FETCH_MOVIE, {
    variables: {
      params: {
        tmdbId,
      },
      creditsParams:
        castListType === CastListType.PERSONAL
          ? {
              userId,
            }
          : undefined,
    },
  });
  function toggleCastListType() {
    setCastListType(
      castListType === CastListType.PERSONAL
        ? CastListType.ALL
        : CastListType.PERSONAL
    );
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>{data.fetchMovie.title}</h1>
      <Image
        src={`https://www.themoviedb.org/t/p/w500/${data.fetchMovie.posterPath}`}
        width={200}
        alt={`Poster for ${data.fetchMovie.title}`}
        className="poster"
      />
      <h3>Credits: {data.fetchMovie.credits.totalCount}</h3>
      <div>
        Mode:
        <Switch
          checked={castListType === CastListType.PERSONAL}
          checkedChildren={"Personalized"}
          unCheckedChildren={"All"}
          onChange={toggleCastListType}
        />
      </div>
      <CastList cast={data.fetchMovie.credits.edges} />
    </div>
  );
}
