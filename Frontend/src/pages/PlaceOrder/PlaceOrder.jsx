import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
const PlaceOrder = () => {
  const { getTotalCartAmount, setShowLogin, token, foodList, cartItems, url } =
    useContext(StoreContext);


  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    let orderItems = [];
    foodList.map((item) => {
      if (cartItems[item._id]) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
    console.log(orderData);
    let response = await axios.post(`${url}/api/order/placeorder`, orderData, {
      headers: {
         token
      }
  });
  

    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="first name"
          />
          <input
            required
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            placeholder="last name"
            value={data.lastName}
          />
        </div>
        <input
          required
          type="text"
          name="email"
          onChange={onChangeHandler}
          placeholder="Email address"
          value={data.email}
        />
        <input
          required
          type="text"
          name="street"
          onChange={onChangeHandler}
          placeholder="Street"
          value={data.street}
        />
        <div className="multi-fields">
          <input
            required
            type="text"
            placeholder="city"
            name="city"
            value={data.city}
            onChange={onChangeHandler}
          />
          <input
            required
            type="text"
            placeholder="state"
            name="state"
            value={data.street}
            onChange={onChangeHandler}
          />
        </div>
        <div className="multi-fields">
          <input
            required
            type="text"
            value={data.zip}
            placeholder="zip code"
            name="zip"
            onChange={onChangeHandler}
          />
          <input
            required
            type="text"
            value={data.country}
            placeholder="country"
            name="country"
            onChange={onChangeHandler}
          />
        </div>
        <input
          required
          type="text"
          value={data.phone}
          placeholder="phone"
          name="phone"
          onChange={onChangeHandler}
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>&#8377;{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>&#8377;{getTotalCartAmount() === 0 ? 0 : 160}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>
              &#8377;{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 160}
              </p>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
