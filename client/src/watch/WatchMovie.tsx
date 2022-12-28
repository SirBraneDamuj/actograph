import { gql, useMutation } from "@apollo/client";
import { Button, Input } from "antd";
import { useState } from "react";
import useUserId from "../login/useUserId";
import MovieCard from "../movie/MovieCard";

const WATCH_MOVIE = gql`
  mutation WatchMovie($params: MarkWatchedMovieParams!) {
    markWatchedMovie(params: $params) {
      title
      tmdbId
      posterPath
    }
  }
`;

export default function WatchMovie() {
  const userId = useUserId();
  const [tmdbId, setTmdbId] = useState("");
  const [mutateFunction, { data, loading }] = useMutation(WATCH_MOVIE);

  function submitWatchedMovie() {
    const variables = {
      params: {
        tmdbId,
        userId,
      },
    };
    mutateFunction({ variables });
  }

  function movieForm() {
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <>
        <Input
          value={tmdbId}
          placeholder={"TMDB ID"}
          onChange={(e) => setTmdbId(e.target.value)}
        />
        <Button type="primary" onClick={submitWatchedMovie}>
          Submit
        </Button>
      </>
    );
  }

  function result() {
    if (loading || !data) {
      return null;
    }
    const { title, tmdbId, posterPath } = data.markWatchedMovie;
    return (
      <div>
        <MovieCard title={title} tmdbId={tmdbId} posterPath={posterPath} />
      </div>
    );
  }

  if (!userId) return null;

  return (
    <div>
      <h3>Log Watched Movie</h3>
      {movieForm()}
      {result()}
    </div>
  );
}
