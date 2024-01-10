import React, { useState, useEffect } from "react";
import { Card, Form, Button, Input, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
  logout,
} from "../../api/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "antd/dist/antd.min.css";

const LoginModule = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  //for login form
  const onFinish = (values) => {
    logInWithEmailAndPassword(values.email, values.password);
  };

  //for login with google
  useEffect(() => {
    if (loading) return;

    if (user) navigate("/home");
  }, [user, loading]);

  return (
    <Card
      title="Login with your account"
      className="elevated rounded"
      bodyStyle={{ minHeight: "70vh" }}
      footer={null}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your TMU email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <center>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{
                  width: "100%",
                  height: "5vh",
                  backgroundColor: "#1a72ee",
                }}
              >
                <h4 style={{ color: "#FFFFFF", paddingTop: "5px" }}>Log in</h4>
              </Button>
            </center>

            <div style={{ marginTop: "1vh", marginBottom: "1vh" }}>
              <center>
                <h3>Or</h3>
              </center>
            </div>
            <center>
              <Button
                type="primary"
                className="login-form-button"
                style={{
                  width: "100%",
                  height: "5vh",
                  backgroundColor: "#1a72ee",
                }}
                onClick={signInWithGoogle}
              >
                <h4 style={{ color: "#FFFFFF", paddingTop: "5px" }}>
                  Sign in with Google
                </h4>
              </Button>
            </center>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default LoginModule;
