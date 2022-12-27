import { gql, useQuery } from "@apollo/client";
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
  const userId = "49480f48-2a51-4e74-9af6-58b8b6fda848";
  const { loading, data } = useQuery(GET_USER, {
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
    } else {
      return <h2>Hello, {data.fetchUser.username}!</h2>;
    }
  }
  function stats() {
    if (loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <div>Total Movies: {data.fetchUser.watchedMovies.totalCount}</div>
        </div>
      );
    }
  }
  function movieGrid() {
    return data.fetchUser.watchedMovies.edges.map((edge: any) => (
      <MovieCard
        tmdbId={edge.node.tmdbId}
        title={edge.node.title}
        posterPath={edge.node.posterPath}
      ></MovieCard>
    ));
  }
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
