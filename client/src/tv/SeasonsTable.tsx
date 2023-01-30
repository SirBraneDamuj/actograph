import { ExportOutlined } from "@ant-design/icons";
import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { TvEpisode, TvSeason, TvShowInfo } from "./types";

export type SeasonsTableProps = {
  tvShowId: string;
  seasons: TvSeason[];
};
export function SeasonsTable({ tvShowId, seasons }: SeasonsTableProps) {
  const columns: ColumnsType<TvSeason> = [
    {
      title: "Season Number",
      dataIndex: "seasonNumber",
      key: "seasonNumber",
    },
    {
      title: "Episode Count",
      dataIndex: "numEpisodes",
      key: "numEpisodes",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: TvSeason) => (
        <Space size="middle">
          <Link to={`/watch/tv/${tvShowId}/season/${record.seasonNumber}`}>
            Episodes
          </Link>
          <a
            href={`https://www.themoviedb.org/tv/${tvShowId}/season/${record.seasonNumber}`}
            target={"_blank"}
            rel="noreferrer"
          >
            TMDB <ExportOutlined />
          </a>
        </Space>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={seasons}
      rowKey={(record) => record.seasonNumber}
      pagination={false}
    />
  );
}

export type SeasonDetailsProps = {
  tvShow: TvShowInfo;
  season: TvSeason;
  episodes: TvEpisode[];
};
export function SeasonDetails({
  tvShow,
  season,
  episodes,
}: SeasonDetailsProps) {
  const columns: ColumnsType<TvEpisode> = [
    {
      title: "Episode Number",
      dataIndex: "episodeNumber",
      key: "episodeNumber",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: TvEpisode) => (
        <Space size="middle">
          <Link
            to={`/watch/tv/${tvShow.tmdbId}/season/${record.seasonNumber}/episode/${record.episodeNumber}`}
          >
            Credits
          </Link>
          <a
            href={`https://www.themoviedb.org/tv/${tvShow.tmdbId}/season/${record.seasonNumber}/episode/${record.episodeNumber}`}
            target={"_blank"}
            rel="noreferrer"
          >
            TMDB <ExportOutlined />
          </a>
        </Space>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={episodes}
      pagination={false}
      rowKey={"id"}
    />
  );
}
