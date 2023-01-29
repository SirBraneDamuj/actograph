import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { TvSeason } from "./types";

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
            View
          </Link>
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
