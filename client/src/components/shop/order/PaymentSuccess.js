import React, { Fragment } from "react";
import Layout from "../layout";
import { CheckoutMoMo } from "./checkoutMoMo";

const PaymentSuccess = (props) => {
  return (
    <Fragment>
      <Layout children={<CheckoutMoMo />} />
    </Fragment>
  );
};

export default PaymentSuccess;
