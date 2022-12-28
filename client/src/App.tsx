import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Menu from "antd/es/menu";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./home/Home";
import Login from "./login/Login";
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
          <Menu theme="light" mode="horizontal" items={menuItems}></Menu>
        </Header>
        <Content style={{ padding: 10 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
