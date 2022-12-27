import { Card } from "antd";
import "./MovieCard.css";

type MovieCardProps = {
  tmdbId: string;
  title: string;
  posterPath?: string;
};

export default function MovieCard({
  tmdbId,
  title,
  posterPath,
}: MovieCardProps) {
  return (
    <Card
      hoverable
      style={{ width: 175, display: "inline-block", margin: 5 }}
      cover={
        <img
          src={`https://www.themoviedb.org/t/p/w154/${posterPath}`}
          alt={`Poster for ${title}`}
          className="poster"
        ></img>
      }
      onClick={() =>
        window.open(`https://www.themoviedb.org/movie/${tmdbId}`, "_blank")
      }
    >
      <Card.Meta
        title={<div className="MovieCardTitle">{title}</div>}
      ></Card.Meta>
    </Card>
  );
}
