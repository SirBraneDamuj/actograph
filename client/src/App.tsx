import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Menu from "antd/es/menu";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./home/Home";
import Watch from "./watch/Watch";

const menuItems = [
  {
    label: <Link to={"/"}>Home</Link>,
    key: "home",
  },
  {
    label: <Link to={"/watch"}>Watch</Link>,
    key: "watch",
  },
];

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header>
          <Menu mode="horizontal" items={menuItems}></Menu>
        </Header>
        <Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch" element={<Watch />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
