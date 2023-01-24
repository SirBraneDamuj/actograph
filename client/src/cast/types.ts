export type PersonCastEdge = {
  characterName: string;
  node: {
    tmdbId: string;
    name: string;
    profilePath: string;
    movies: {
      totalCount: number;
      edges: {
        characterName: string;
        node: {
          tmdbId: string;
          title: string;
          posterPath: string;
        };
      }[];
    };
  };
};
