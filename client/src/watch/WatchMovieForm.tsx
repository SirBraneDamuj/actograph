import { Button, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserId from "../login/useUserId";

// const WATCH_MOVIE = gql`
//   mutation WatchMovie($params: MarkWatchedMovieParams!) {
//     markWatchedMovie(params: $params) {
//       title
//       tmdbId
//       posterPath
//     }
//   }
// `;

export function WatchMovieForm() {
  const userId = useUserId();
  const [tmdbId, setTmdbId] = useState("");
  const navigate = useNavigate();

  function navigateToWatchMovie() {
    navigate(`/watch/movie/${tmdbId}`);
  }

  if (!userId) return null;

  return (
    <div>
      <h3>View Movie</h3>
      <Input
        value={tmdbId}
        placeholder={"TMDB ID"}
        onChange={(e) => setTmdbId(e.target.value)}
      />
      <Button type="primary" onClick={navigateToWatchMovie}>
        Submit
      </Button>
    </div>
  );
}
