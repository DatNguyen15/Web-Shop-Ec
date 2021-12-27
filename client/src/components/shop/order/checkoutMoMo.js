import React, { Fragment, useEffect, useContext, useState } from "react";
import { LayoutContext } from "../layout";
import { useHistory } from "react-router-dom";
export const CheckoutMoMo = (props) => {
  const { data, dispatch } = useContext(LayoutContext);
  const history = useHistory();
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify([]));
    dispatch({ type: "cartProduct", payload: null });
    dispatch({ type: "cartTotalCost", payload: null });
    //dispatch({ type: "orderSuccess", payload: true });
    dispatch({ type: "loading", payload: false });
    alert("Ordered successfully");
    window.open("/", "_self");
  }, []);
  return (
    <Fragment>
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <p>You have successfully paid for your order. Thank you !</p>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{ height: "32px", width: "32px" }}
              src="https://img.thuthuatphanmem.vn/uploads/2018/09/22/hinh-icon-mat-cuoi_020028296.jpg"
            ></img>
            <img
              style={{ height: "32px", width: "32px" }}
              src="https://img.thuthuatphanmem.vn/uploads/2018/09/22/hinh-icon-mat-cuoi_020028296.jpg"
            ></img>
            <img
              style={{ height: "32px", width: "32px" }}
              src="https://img.thuthuatphanmem.vn/uploads/2018/09/22/hinh-icon-mat-cuoi_020028296.jpg"
            ></img>
          </p>
        </div>
      </div>
    </Fragment>
  );
};
