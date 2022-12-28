import { gql, useQuery } from "@apollo/client";
import useUserId from "../login/useUserId";
import MovieCard from "../movie/MovieCard";
import "./Home.css";

const GET_USER = gql`
  query GetUser(
    $params: UserFetchParams!
    $watchedMovieParams: WatchedMoviesParams
  ) {
    fetchUser(params: $params) {
      id
      username
      watchedMovies(params: $watchedMovieParams) {
        totalCount
        edges {
          node {
            posterPath
            title
            tmdbId
          }
        }
      }
    }
  }
`;

export default function Home() {
  const userId = useUserId();
  const { loading, data } = useQuery(GET_USER, {
    skip: !userId,
    variables: {
      params: {
        userId,
      },
      watchedMovieParams: {
        sorting: {
          direction: "desc",
          by: "WATCH_DATE",
        },
        pagination: {
          first: 5,
        },
      },
    },
  });
  function greeting() {
    if (loading) {
      return null;
    }
    return <h2>Hello, {data.fetchUser.username}!</h2>;
  }
  function stats() {
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <div>Total Movies: {data.fetchUser.watchedMovies.totalCount}</div>
      </div>
    );
  }
  function movieGrid() {
    if (loading) {
      return null;
    }
    return data.fetchUser.watchedMovies.edges.map((edge: any) => (
      <MovieCard
        tmdbId={edge.node.tmdbId}
        title={edge.node.title}
        posterPath={edge.node.posterPath}
        key={edge.node.tmdbId}
      ></MovieCard>
    ));
  }
  if (!userId) return null;
  return (
    <div className="Home">
      <h1>Actograph</h1>
      {greeting()}
      <h3>Movies</h3>
      {stats()}
      <h4>Watched recently:</h4>
      {movieGrid()}
    </div>
  );
}
