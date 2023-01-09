import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Space } from "antd";

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
          characterName: string;
          node: {
            tmdbId: string;
            title: string;
            posterPath: string;
          };
        }[];
      };
    };
  }[];
  showRelated: boolean;
};

function CastCard({
  person,
  showRelated,
}: {
  person: CastListProps["cast"][number];
  showRelated: boolean;
}) {
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
  function creditsCards() {
    if (!showRelated) return null;
    return person.node.movies.edges.map((otherMovie, i) => {
      return (
        <Card
          style={{ width: 150 }}
          key={`${otherMovie.node.tmdbId}_${i}`}
          type="inner"
          title={otherMovie.node.title}
          cover={
            <img
              src={`https://www.themoviedb.org/t/p/w500/${otherMovie.node.posterPath}`}
              alt={otherMovie.node.title}
            />
          }
        >
          <Card.Meta description={otherMovie.characterName} />
        </Card>
      );
    });
  }
  return (
    <Card
      title={characterName}
      extra={
        <a
          href={`https://www.themoviedb.org/person/${tmdbId}`}
          target="_blank"
          rel="noreferrer"
        >
          TMDB
        </a>
      }
    >
      <Space direction="vertical">
        <Card.Meta avatar={personAvatar()} description={name} />
        <Space>{creditsCards()}</Space>
      </Space>
    </Card>
  );
}

export function CastList({ cast, showRelated }: CastListProps) {
  function cards() {
    return cast.map((person, i) => (
      <CastCard
        key={person.node.name + i.toString()}
        person={person}
        showRelated={showRelated}
      />
    ));
  }
  return <Space direction="vertical">{cards()}</Space>;
}
