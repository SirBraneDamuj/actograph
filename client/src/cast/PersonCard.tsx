import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Row, Space } from "antd";
import { ReactNode } from "react";
import { PersonCastEdge } from "./types";

type PersonAvatarProps = {
  profilePath: string | null;
};
const avatarSizes = {
  xs: 64,
  sm: 64,
  md: 64,
  lg: 64,
  xl: 64,
  xxl: 64,
};
function PersonAvatar({ profilePath }: PersonAvatarProps) {
  if (!profilePath) {
    return <Avatar icon={<UserOutlined />} size={avatarSizes} />;
  } else {
    return (
      <Avatar
        src={`https://www.themoviedb.org/t/p/w185/${profilePath}`}
        size={avatarSizes}
      />
    );
  }
}

type BaseCardProps = {
  person: PersonCastEdge;
  cardContent?: ReactNode;
};
function BaseCard({ person, cardContent }: BaseCardProps) {
  const { characterName } = person;
  const { name, profilePath, tmdbId } = person.node;
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
        <Card.Meta
          avatar={<PersonAvatar profilePath={profilePath} />}
          description={name}
        />
        {cardContent && <Space>{cardContent}</Space>}
      </Space>
    </Card>
  );
}

type AppearanceCardProps = {
  otherMovie: PersonCastEdge["node"]["movies"]["edges"][number];
};
function AppearanceCard({ otherMovie }: AppearanceCardProps) {
  return (
    <Card
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
}

const castListSpans = {
  xs: 12,
  sm: 8,
  md: 6,
  lg: 6,
  xl: 6,
  xxl: 6,
};
export type CharacterCardWithRelatedProps = {
  person: PersonCastEdge;
};
export function CharacterCardWithOtherAppearances({
  person,
}: CharacterCardWithRelatedProps) {
  function creditsCards() {
    const cards = person.node.movies.edges.map((otherMovie, i) => (
      <Col {...castListSpans} key={`${otherMovie.node.tmdbId}_${i}`}>
        <AppearanceCard otherMovie={otherMovie} />
      </Col>
    ));
    return <Row gutter={[5, 5]}>{cards}</Row>;
  }
  return <BaseCard person={person} cardContent={creditsCards()} />;
}

export type CharacterCardProps = {
  person: PersonCastEdge;
};
export function CharacterCard({ person }: CharacterCardProps) {
  return <BaseCard person={person} />;
}
