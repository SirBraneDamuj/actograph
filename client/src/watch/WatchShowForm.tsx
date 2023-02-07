import { Button, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserId from "../login/useUserId";

export function WatchShowForm() {
  const userId = useUserId();
  const [tmdbId, setTmdbId] = useState("");
  const navigate = useNavigate();

  function navigateToWatchShow() {
    navigate(`/watch/tv/${tmdbId}`);
  }

  if (!userId) return null;

  return (
    <div>
      <h3>View Show</h3>
      <Input
        value={tmdbId}
        placeholder={"TMDB ID"}
        onChange={(e) => setTmdbId(e.target.value)}
      />
      <Button type="primary" onClick={navigateToWatchShow}>
        Submit
      </Button>
    </div>
  );
}
