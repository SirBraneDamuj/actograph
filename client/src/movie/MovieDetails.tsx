import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import useUserId from "../login/useUserId";

const FETCH_MOVIE = gql`
  query FetchMovie($params: FetchMovieParams!) {
    fetchMovie(params: $params) {
      tmdbId
      title
      posterPath
      credits {
        totalCount
      }
    }
  }
`;

export function MovieDetails() {
  useUserId();
  const { tmdbId } = useParams();
  const { loading, data } = useQuery(FETCH_MOVIE, {
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
    <div>
      <h1>{data.fetchMovie.title}</h1>
      <img
        src={`https://www.themoviedb.org/t/p/w154/${data.fetchMovie.posterPath}`}
        alt={`Poster for ${data.fetchMovie.title}`}
        className="poster"
      ></img>
      <h3>Credits: {data.fetchMovie.credits.totalCount}</h3>
    </div>
  );
}
