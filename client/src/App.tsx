import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Menu from "antd/es/menu";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import { History } from "./history/History";
import Home from "./home/Home";
import Login from "./login/Login";
import { MovieDetails } from "./movie/MovieDetails";
import { EpisodeDetails } from "./tv/EpisodeDetails";
import { TvShowDetails } from "./tv/ShowDetails";
import Watch from "./watch/Watch";

const menuItems = [
  {
    label: <Link to={"/"}>Home</Link>,
    key: "home",
  },
  {
    label: <Link to={"/history"}>History</Link>,
    key: "history",
  },
  {
    label: <Link to={"/watch"}>Watch</Link>,
    key: "watch",
  },
  {
    label: <Link to={"/login"}>Login</Link>,
    key: "login",
  },
];

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" items={menuItems}></Menu>
        </Header>
        <Content style={{ padding: 10 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/watch/movie/:tmdbId" element={<MovieDetails />} />
            <Route path="/watch/tv/:tmdbId" element={<TvShowDetails />} />
            <Route
              path="/watch/tv/:tmdbId/season/:seasonNumber/episode/:episodeNumber"
              element={<EpisodeDetails />}
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
