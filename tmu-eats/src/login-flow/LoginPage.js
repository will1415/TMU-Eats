import React from "react";
import { Row, Col } from "antd";
import Graphic from "./components/Graphic";
import LoginModule from "./components/LoginModule";
import "antd/dist/antd.min.css";

const LoginPage = () => {
  return (
    <div className="home">
      <Row
        style={{
          marginTop: "10vh",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          zIndex: 3,
          marginBottom: "20vh",
        }}
      >
        <Col xs={24} md={14}>
          <Graphic />
        </Col>
        <Col xs={24} md={10}>
          <Row>
            <Col xs={0} md={2}></Col>
            <Col xs={24} md={20}>
              <LoginModule />
            </Col>
            <Col xs={0} md={2}></Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default LoginPage;
