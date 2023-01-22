import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserContextProvider } from "./provider/UserContextProvider";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          fetchWatchedMovies: {
            keyArgs: ["userId"],
            merge: (existing, incoming) => {
              console.log(existing, incoming);
              return {
                totalCount: incoming.totalCount,
                pageInfo: incoming.pageInfo,
                edges: [...(existing?.edges || []), ...incoming.edges],
              };
            },
          },
        },
      },
    },
  }),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </UserContextProvider>
  </React.StrictMode>
);
