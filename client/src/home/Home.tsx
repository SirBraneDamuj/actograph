import { gql, useQuery } from "@apollo/client";

const GET_USER = gql`
  query GetUser($params: UserFetchParams!) {
    fetchUser(params: $params) {
      id
      username
    }
  }
`;

export default function Home() {
  const userId = "49480f48-2a51-4e74-9af6-58b8b6fda848";
  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      params: {
        userId,
      },
    },
  });
  if (loading) {
    return <div>Loading...</div>;
  } else {
    return <div>Hello, {data.fetchUser.username}!</div>;
  }
}
