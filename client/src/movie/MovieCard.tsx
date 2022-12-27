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
  function poster() {
    if (posterPath) {
      return (
        <img
          src={`https://www.themoviedb.org/t/p/w92/${posterPath}`}
          alt={`Poster for ${title}`}
          className="poster"
        ></img>
      );
    } else {
      return null;
    }
  }
  return (
    <div className="MovieCard">
      <div className="title">
        <a
          href={`https://themoviedb.org/movie/${tmdbId}`}
          target="_blank"
          rel="noreferrer"
        >
          {title}
        </a>
      </div>
      {poster()}
    </div>
  );
}
