import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "../src/login-flow/LoginPage";
import Cart from "../src/item-flow/Cart";
import HomePage from "../src/home-flow/HomePage";
import "antd/dist/antd.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
