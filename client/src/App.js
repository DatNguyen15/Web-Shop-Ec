import React, { Fragment, useReducer, useEffect } from "react";
import Routes from "./components";
import {
  LayoutContext,
  layoutState,
  layoutReducer,
  isAuthenticate,
} from "./components/shop";

import alanBtn from "@alan-ai/alan-sdk-web";
import { useHistory } from "react-router-dom";
import COMMANDS from "./components/alanCommands";

function App() {
  const [data, dispatch] = useReducer(layoutReducer, layoutState);
  const history = useHistory();
  useEffect(() => {
    alanBtn({
      key: "7ff6cbaa1fa81f35a6f1516d0bfbf7122e956eca572e1d8b807a3e2338fdd0dc/testing",
      onCommand: (commandData) => {
        if (COMMANDS[commandData.command]) {
          window.dispatchEvent(
            new CustomEvent(COMMANDS[commandData.command], {
              detail: commandData,
            })
          );
        }
        if (commandData.command == "home_page") {
          window.open("/", "_self");
          //history.push("/");
        }
        if (commandData.command == "phone_categori") {
          window.open("/products/category/609ce481391bda22204654f5", "_self");
        }
        if (commandData.command == "laptop_categori") {
          window.open("/products/category/606aa11b241abf45a08f77c0", "_self");
        }
        if (commandData.command == "apple_categori") {
          window.open("/products/category/606be4891bc22455ecb7b0c5", "_self");
        }
        if (commandData.command == "tablet_categori") {
          window.open("/products/category/606be4c01bc22455ecb7b0c7", "_self");
        }
        if (commandData.command == "open cart") {
          dispatch({ type: "cartModalToggle", payload: !data.cartModal });
        }
        if (commandData.command == "close cart") {
          dispatch({ type: "cartModalToggle", payload: data.cartModal });
        }
        if (commandData.command == "check out") {
          //alert(JSON.parse(localStorage.getItem("cart")));
          if (
            JSON.parse(localStorage.getItem("cart")) !== null &&
            isAuthenticate()
          ) {
            window.open("/checkout", "_self");
          } else {
            alert("You don't have any products or login!!!");
          }
        }
        // if (commandData.command.startsWith("add_product:")=="add_product:") {

        //  // window.open("/checkout", "_self");
        // }
      },
    });
  }, []);
  return (
    <Fragment>
      <LayoutContext.Provider value={{ data, dispatch }}>
        <Routes />
      </LayoutContext.Provider>
    </Fragment>
  );
}

export default App;
