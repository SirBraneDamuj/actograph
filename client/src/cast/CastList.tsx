import { Col, Row } from "antd";
import { CharacterCard, CharacterCardWithOtherAppearances } from "./PersonCard";
import { PersonCastEdge } from "./types";

export type CastListProps = {
  cast: PersonCastEdge[];
  showRelated: boolean;
};
const castListSpans = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 4,
  xxl: 4,
};
export function CastList({ cast, showRelated }: CastListProps) {
  function cards() {
    return cast.map((person, i) => {
      if (showRelated) {
        return (
          <Col key={person.node.name + i.toString()} span={24}>
            <CharacterCardWithOtherAppearances person={person} />
          </Col>
        );
      } else {
        return (
          <Col key={person.node.name + i.toString()} {...castListSpans}>
            <CharacterCard
              key={person.node.name + i.toString()}
              person={person}
            />
          </Col>
        );
      }
    });
  }
  return <Row gutter={[5, 5]}>{cards()}</Row>;
}
