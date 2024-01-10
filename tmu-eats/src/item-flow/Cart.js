import "./Cart.css";
import TMU from "../images/TMU.png";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { message } from "antd";
import { addOrderHistory } from "../api/Firebase";

const Cart = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchParams] = useSearchParams();

  //trying something
  const [tipAmount, setTip] = useState(0);

  const handleTip = (event) => {
    setTip(event.target.value);
    console.log(searchParams.getAll("items"));
  };

  function isEmmpty(value) {
    console.log(value);
    if (value == "") {
      return true;
    } else {
      return false;
    }
  }

  function popup() {
    if (totalItems !== 0) {
      alert("Purchase successful!");
      addOrderHistory(
        searchParams.getAll("items"),
        searchParams.getAll("restaurant"),
        totalPrice
      );
    } else {
      alert("Purchase failed :(");
    }
  }

  useEffect(() => {
    let sum = 0;
    searchParams.getAll("prices").forEach((item) => (sum += Number(item)));
    setTotalPrice(sum);
    setTotalItems(searchParams.getAll("items").length);
  });

  return (
    <div class="card">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = "http://localhost:3000/home";
        }}
      >
        {" "}
        Homepage
      </button>

      <div>
        <div class="col-md-8 cart">
          <div class="title">
            <div>
              <div>
                <h4>
                  <b>Shopping Cart</b>
                </h4>
              </div>
            </div>
          </div>
          {searchParams.getAll("items").map((item, index) => (
            <div class="cart-row">
              <div id="item">{item}</div>
              <div id="item-price">{searchParams.getAll("prices")[index]}</div>
            </div>
          ))}
        </div>
        <div class="col-md-4 summary">
          <div>
            <h2>
              <b>Summary</b>
            </h2>
          </div>

          <div class="row">
            <div class="col">Total Items: {totalItems}</div>
            <div class="col text-right">Total Price: {totalPrice}</div>
          </div>
          <form>
            <p>SHIPPING</p>
            <select>
              <option class="text-muted">Standard-Delivery - $5.00</option>
            </select>
            <p>Tip Amount</p>
            <input
              id="code"
              value={tipAmount}
              type="number"
              onChange={handleTip}
              defaultValue="5"
              placeholder="Enter the tipping amount"
            />
          </form>

          <div class="row">
            <div class="col">TOTAL PRICE</div>
            <div class="col text-right">
              {" "}
              ${" "}
              {(
                totalPrice +
                5 +
                (isEmmpty(tipAmount) ? 0.0 : parseFloat(tipAmount))
              ).toFixed(2)}
            </div>
          </div>
          <button onClick={popup} class="btn">
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
