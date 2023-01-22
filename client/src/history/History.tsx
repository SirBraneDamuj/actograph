import { gql, useQuery } from "@apollo/client";
import { Button, Col, Row, Spin } from "antd";
import useUserId from "../login/useUserId";
import MovieCard from "../movie/MovieCard";

const GET_USER = gql`
  query FetchWatchedMovies($userId: ID!, $params: WatchedMoviesParams!) {
    fetchWatchedMovies(userId: $userId, params: $params) {
      totalCount
      edges {
        node {
          posterPath
          title
          tmdbId
        }
      }
      pageInfo {
        firstCursor
        endCursor
        hasPrevPage
        hasNextPage
      }
    }
  }
`;

const watchedMovieParams = {
  sorting: {
    direction: "desc",
    by: "WATCH_DATE",
  },
  pagination: {
    first: 15,
    after: null,
  },
};

export function History() {
  const userId = useUserId();
  const { loading, data, fetchMore } = useQuery(GET_USER, {
    skip: !userId,
    variables: {
      userId,
      params: watchedMovieParams,
    },
  });

  function onLoadMoreClick() {
    fetchMore({
      variables: {
        userId,
        params: {
          ...watchedMovieParams,
          pagination: {
            first: 15,
            after: data.fetchWatchedMovies.pageInfo.endCursor,
          },
        },
      },
    });
  }

  function movieCards() {
    if (loading) {
      return <Spin />;
    }
    const cols = data.fetchWatchedMovies.edges.map((edge: any) => {
      const { node } = edge;
      return (
        <Col key={node.tmdbId}>
          <MovieCard
            tmdbId={node.tmdbId}
            posterPath={node.posterPath}
            title={node.title}
          />
        </Col>
      );
    });
    const hasNextPage = data.fetchWatchedMovies.pageInfo.hasNextPage;
    return (
      <Row>
        {cols}
        {hasNextPage && (
          <Col>
            <Button onClick={onLoadMoreClick}>Load more...</Button>
          </Col>
        )}
      </Row>
    );
  }

  return (
    <div>
      <h2>Watch History</h2>
      <h3>Movies</h3>
      {movieCards()}
    </div>
  );
}
