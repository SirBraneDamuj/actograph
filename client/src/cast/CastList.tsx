import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";

export type CastListProps = {
  cast: {
    characterName: string;
    node: {
      tmdbId: string;
      name: string;
      profilePath: string;
      movies: {
        totalCount: number;
        edges: {
          node: {
            tmdbId: string;
            title: string;
            posterPath: string;
          };
        };
      }[];
    };
  }[];
};

function CastCard({ person }: { person: CastListProps["cast"][number] }) {
  const { name, profilePath, tmdbId } = person.node;
  const { characterName } = person;
  function personAvatar() {
    if (!profilePath) {
      return <Avatar icon={<UserOutlined />} />;
    } else {
      return (
        <Avatar src={`https://www.themoviedb.org/t/p/w185/${profilePath}`} />
      );
    }
  }
  return (
    <Card>
      <Card.Meta
        avatar={personAvatar()}
        title={name}
        description={characterName}
      />
    </Card>
  );
}

export function CastList({ cast }: CastListProps) {
  function cards() {
    return cast.map((person, i) => (
      <CastCard key={person.node.name + i.toString()} person={person} />
    ));
  }
  return <div>{cards()}</div>;
}
