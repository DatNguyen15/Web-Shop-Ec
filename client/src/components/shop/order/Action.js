import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    let responseData = await getBrainTreeToken();
    if (responseData && responseData) {
      setState({
        clientToken: responseData.clientToken,
        success: responseData.success,
      });
      console.log(responseData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  getPaymentProcess,
  totalCost,
  history
) => {
  console.log(state);
  if (!state.address) {
    setState({ ...state, error: "Please provide your address" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else {
    let nonce;
    let getNonce = state.instance
      .requestPaymentMethod()
      .then((data) => {
        dispatch({ type: "loading", payload: true });
        nonce = data.nonce;
        let paymentData = {
          amountTotal: totalCost(),
          paymentMethod: nonce,
        };
        getPaymentProcess(paymentData)
          .then(async (res) => {
            if (res) {
              let orderData = {
                allProduct: JSON.parse(localStorage.getItem("cart")),
                user: JSON.parse(localStorage.getItem("jwt")).user._id,
                amount: res.transaction.amount,
                transactionId: res.transaction.id,
                address: state.address,
                phone: state.phone,
              };
              try {
                let resposeData = await createOrder(orderData);
                if (resposeData.success) {
                  localStorage.setItem("cart", JSON.stringify([]));
                  dispatch({ type: "cartProduct", payload: null });
                  dispatch({ type: "cartTotalCost", payload: null });
                  dispatch({ type: "orderSuccess", payload: true });
                  setState({ clientToken: "", instance: {} });
                  dispatch({ type: "loading", payload: false });
                  return history.push("/");
                } else if (resposeData.error) {
                  console.log(resposeData.error);
                }
              } catch (error) {
                console.log(error);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
        setState({ ...state, error: error.message });
      });
  }
};

export const payMoMo = async (
  data,
  dispatch,
  state,
  setState,
  momoOrder,
  totalCost,
  history
) => {
  console.log(state);
  if (!state.address) {
    setState({ ...state, error: "Please provide your address" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else {
    let paymentData = {
      amountTotal: totalCost() + "",
      allProduct: JSON.parse(localStorage.getItem("cart")),
      user: JSON.parse(localStorage.getItem("jwt")).user._id,
      //amount: inforMoMO.amount,
      address: state.address,
      phone: state.phone,
    };
    console.log("ppppppppppppppp" + paymentData.amountTotal);
    let changeMoney = Number(paymentData.amountTotal) * 22960;
    //alert(changeMoney);
    if (changeMoney < 20000000) {
      momoOrder(paymentData)
        .then(async (res) => {
          if (res) {
            let inforMoMO = JSON.parse(res);
            window.open(inforMoMO.payUrl, "_self");
          }
        })
        .then(() => {
          localStorage.setItem("cart", JSON.stringify([]));
          dispatch({ type: "cartProduct", payload: null });
          dispatch({ type: "cartTotalCost", payload: null });
          //dispatch({ type: "orderSuccess", payload: true });
          setState({ clientToken: "", instance: {} });
          dispatch({ type: "loading", payload: false });
          //return history.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("MoMo only for payments under 1000$.");
    }
  }
};
// export const returnAfterMoMo = async (dispatch) => {};
